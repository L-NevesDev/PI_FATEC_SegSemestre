/*Jefferson - Referencias que antes eram ao id_produto_pronto agora é ao id_estoque
Agora ta cotando a item_pedido_adicional
Desconto do estoque foi implementado também,antes era em produto_pronto

*/
import db from "../database/connection";
import type { PedidoInput } from "../schemas/pedido.schema";

export const pedidoRepository = {

  listarTodos: () => {
    // trazer nome do cliente e funcionário
    return db.prepare(`
      SELECT
        p.*,
        c.nome AS cliente_nome,
        f.nome AS funcionario_nome
      FROM Pedido p
      JOIN Cliente c ON c.id_cliente = p.id_cliente
      JOIN Funcionario f ON f.id_funcionario = p.id_funcionario
      ORDER BY p.data_pedido DESC
    `).all();
  },

  buscarPorId: (id: number) => {
    const pedido = db.prepare(`
      SELECT p.*, c.nome AS cliente_nome
      FROM Pedido p
      JOIN Cliente c ON c.id_cliente = p.id_cliente
      WHERE p.id_pedido = ?
    `).get(id);

    if (!pedido) return undefined;

    // Busca itens do pedido
    const itens = db.prepare(`
      SELECT
        ip.*,
        e.lote,
        prod.nome_produto
      FROM Item_Pedido ip
      JOIN Estoque e ON e.id_estoque = ip.id_estoque
      JOIN Produto prod ON prod.id_produto = e.id_produto
      WHERE ip.id_pedido = ?
    `).all(id);

    // busca adicionais de cada item
    const itensComAdicionais = (itens as any[]).map(item => {
      const adicionais = db.prepare(
        "SELECT * FROM Item_Pedido_Adicional WHERE id_item_pedido = ?"
      ).all(item.id_item_pedido);
      return { ...item, adicionais };
    });

    return { ...(pedido as object), itens: itensComAdicionais };
  },

  criar: (dados: PedidoInput) => {
    /* db.transaction() é pra tudo acontecer junto
    Se qualquer coisa falhar da rollback automático*/
    const transacao = db.transaction(() => {

      // Calcula o valor total (itens + entrega)
      const totalItens = dados.itens.reduce(
        (soma, item) => soma + item.quantidade * item.valor_unitario, 0
      );
      const totalAdicionais = dados.itens.reduce((soma, item) => {
        const somaAdicionais = (item.adicionais ?? []).reduce(
          (s, ad) => s + ad.preco_adicional, 0
        );
        return soma + somaAdicionais;
      }, 0);
      const valorEntrega = dados.entrega?.valor_entrega ?? 0;
      const valor_total = totalItens + totalAdicionais + valorEntrega;

      // Insere pedido principal
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

      // queries pra ser reutilizadas no loop
      const insItem = db.prepare(`
        INSERT INTO Item_Pedido (id_pedido, id_estoque, quantidade, valor_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)
      `);
      const descontaEstoque = db.prepare(`
        UPDATE Estoque SET quantidade_disponivel = quantidade_disponivel - ?
        WHERE id_estoque = ?
      `);
      const insAdicional = db.prepare(`
        INSERT INTO Item_Pedido_Adicional (id_item_pedido, nome_adicional, preco_adicional)
        VALUES (?, ?, ?)
      `);

      // Insere cada item e desconta do estoque
      dados.itens.forEach(item => {
        const subtotal = item.quantidade * item.valor_unitario;

        const itemResult = insItem.run(
          id_pedido,
          item.id_estoque,
          item.quantidade,
          item.valor_unitario,
          subtotal
        );
        const id_item_pedido = Number(itemResult.lastInsertRowid);

        // Desconta quantidade do estoque
        descontaEstoque.run(item.quantidade, item.id_estoque);

        //Insere adicionais desse item (se tiver)
        (item.adicionais ?? []).forEach(ad => {
          insAdicional.run(id_item_pedido, ad.nome_adicional, ad.preco_adicional);
        });
      });

      // Se tiver entrega, registra na tabela Entrega
      if (dados.entrega) {
        db.prepare(`
          INSERT INTO Entrega (id_pedido, nome_recebedor, endereco_entrega, valor_entrega, status_entrega)
          VALUES (?, ?, ?, ?, 'AGUARDANDO')
        `).run(
          id_pedido,
          dados.entrega.nome_recebedor ?? null,
          dados.entrega.endereco_entrega,
          dados.entrega.valor_entrega
        );
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