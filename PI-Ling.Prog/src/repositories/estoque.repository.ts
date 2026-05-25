import db from "../database/connection";
import type { Estoque } from "../schemas/estoque.schema";

export const estoqueRepository = {

  listarTodos: (): Estoque[] => {
    return db.prepare(`
      SELECT e.*, p.nome_produto
      FROM Estoque e
      JOIN Produto p ON p.id_produto = e.id_produto
      ORDER BY e.data_validade ASC
    `).all() as Estoque[];
  },

  buscarPorId: (id: number): Estoque | undefined => {
    return db.prepare(
      "SELECT * FROM Estoque WHERE id_estoque = ?"
    ).get(id) as Estoque | undefined;
  },

  criar: (dados: Omit<Estoque, "id_estoque">): Estoque => {
    const resultado = db.prepare(`
      INSERT INTO Estoque (id_produto, quantidade_disponivel, data_producao, data_validade, lote)
      VALUES (@id_produto, @quantidade_disponivel, @data_producao, @data_validade, @lote)
    `).run(dados);
    return { id_estoque: Number(resultado.lastInsertRowid), ...dados };
  },

  // Busca itens com validade próxima
  proximosDoVencimento: (dias: number): Estoque[] => {
    return db.prepare(`
      SELECT e.*, p.nome_produto FROM Estoque e
      JOIN Produto p ON p.id_produto = e.id_produto
      WHERE date(e.data_validade) <= date('now', '+' || ? || ' days')
        AND e.quantidade_disponivel > 0
    `).all(dias) as Estoque[];
  },
};