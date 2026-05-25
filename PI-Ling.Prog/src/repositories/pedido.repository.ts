import db from "../database/connection";
import type { PedidoInput } from "../schemas/pedido.schema";

export const pedidoRepository = {

  listarTodos: () => {
    return db.prepare(`
      SELECT p.*, c.nome as cliente_nome, f.nome as funcionario_nome
      FROM Pedido p
      JOIN Cliente c ON c.id_cliente = p.id_cliente
      JOIN Funcionario f ON f.id_funcionario = p.id_funcionario
      ORDER BY p.data_pedido DESC
    `).all();
  },

  buscarPorId: (id: number) => {
    const pedido = db.prepare(`
      SELECT p.*, c.nome as cliente_nome
      FROM Pedido p
      JOIN Cliente c ON c.id_cliente = p.id_cliente
      WHERE p.id_pedido = ?
    `).get(id);

    if (!pedido) return undefined;

    // Busca os itens do pedido separadamente
    const itens = db.prepare(`
      SELECT ip.*, pr.id_estoque
      FROM Item_Pedido ip
      JOIN Produto_Pronto pr ON pr.id_produto_pronto = ip.id_produto_pronto
      WHERE ip.id_pedido = ?
    `).all(id);

    return { ...(pedido as object), itens };
  },

  criar: (dados: PedidoInput) => {
    // TRANSAÇÃO: pedido + itens + entrega tudo junto
    const transacao = db.transaction(() => {
      // Calcula o valor total
      const totalItens = dados.itens.reduce(
        (soma, item) => soma + item.quantidade * item.valor_unitario, 0
      );
      const valorEntrega = dados.entrega?.valor_entrega ?? 0;
      const valor_total = totalItens + valorEntrega;

      // 1. Insere o pedido
      const pedidoResult = db.prepare(`
        INSERT INTO Pedido (id_cliente, id_funcionario, data_pedido, data_entrega, status_pedido, valor_total, observacoes)
        VALUES (@id_cliente, @id_funcionario, @data_pedido, @data_entrega, @status_pedido, @valor_total, @observacoes)
      `).run({
        id_cliente: dados.id_cliente,
        id_funcionario: dados.id_funcionario,
        data_pedido: new Date().toISOString(),
        data_entrega: dados.data_entrega,
        status_pedido: "PENDENTE",
        valor_total,
        observacoes: dados.observacoes ?? null,
      });

      const id_pedido = Number(pedidoResult.lastInsertRowid);

      // 2. Insere cada item e desconta do Produto_Pronto
      const insItem = db.prepare(`
        INSERT INTO Item_Pedido (id_pedido, id_produto_pronto, quantidade, valor_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)
      `);
      const atualizaEstoque = db.prepare(`
        UPDATE Produto_Pronto SET quantidade = quantidade - ?
        WHERE id_produto_pronto = ?
      `);

      dados.itens.forEach(item => {
        const subtotal = item.quantidade * item.valor_unitario;
        insItem.run(id_pedido, item.id_produto_pronto, item.quantidade, item.valor_unitario, subtotal);
        atualizaEstoque.run(item.quantidade, item.id_produto_pronto); // baixa o estoque
      });

      // 3. Se tiver entrega, registra
      if (dados.entrega) {
        db.prepare(`
          INSERT INTO Entrega (id_pedido, endereco_entrega, nome_recebedor, valor_entrega, status_entrega)
          VALUES (?, @endereco_entrega, @nome_recebedor, @valor_entrega, 'AGUARDANDO')
        `).run(id_pedido, dados.entrega);
      }

      return { id_pedido, valor_total, status_pedido: "PENDENTE" };
    });

    return transacao();
  },

  atualizarStatus: (id: number, status: string): void => {
    db.prepare(
      "UPDATE Pedido SET status_pedido = ? WHERE id_pedido = ?"
    ).run(status, id);
  },
};