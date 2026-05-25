import db from "../database/connection";
import type { ProdutoPronto } from "../schemas/produtoPronto.schema";

export const produtoProntoRepository = {

  // Lista só o que está disponível para venda, com informações do produto
  listarDisponiveis: (): ProdutoPronto[] => {
    return db.prepare(`
      SELECT pp.*, p.nome_produto, p.preco_base, e.lote, e.data_validade
      FROM Produto_Pronto pp
      JOIN Estoque e ON e.id_estoque = pp.id_estoque
      JOIN Produto p ON p.id_produto = e.id_produto
      WHERE pp.disponivel_venda = 1 AND pp.quantidade > 0
      ORDER BY e.data_validade ASC
    `).all() as ProdutoPronto[];
  },

  buscarPorId: (id: number): ProdutoPronto | undefined => {
    return db.prepare(
      "SELECT * FROM Produto_Pronto WHERE id_produto_pronto = ?"
    ).get(id) as ProdutoPronto | undefined;
  },

  criar: (dados: Omit<ProdutoPronto, "id_produto_pronto">): ProdutoPronto => {
    const resultado = db.prepare(`
      INSERT INTO Produto_Pronto (id_estoque, quantidade, disponivel_venda)
      VALUES (@id_estoque, @quantidade, @disponivel_venda)
    `).run(dados);
    return { id_produto_pronto: Number(resultado.lastInsertRowid), ...dados };
  },

  atualizarDisponibilidade: (id: number, disponivel: number): void => {
    db.prepare(
      "UPDATE Produto_Pronto SET disponivel_venda = ? WHERE id_produto_pronto = ?"
    ).run(disponivel, id);
  },
};