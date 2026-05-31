import db from "../database/connection";
import type { Produto } from "../schemas/produto.schema";

export const produtoRepository = {

  listarTodos: (): Produto[] => {
    return db.prepare(`
      SELECT p.*, c.nome as categoria_nome
      FROM Produto p
      JOIN CategoriaProduto c ON c.id_categoria = p.id_categoria
      WHERE p.ativo = 1
    `).all() as Produto[];
  },

  buscarPorId: (id: number): Produto | undefined => {
    return db.prepare(
      "SELECT * FROM Produto WHERE id_produto = ? AND ativo = 1"
    ).get(id) as Produto | undefined;
  },

  criar: (dados: Omit<Produto, "id_produto" | "ativo">): Produto => {
    const resultado = db.prepare(`
      INSERT INTO Produto (id_categoria, nome_produto, descricao, preco_base, preco_kg, ativo)
      VALUES (@id_categoria, @nome_produto, @descricao, @preco_base, @preco_kg, 1)
    `).run({ descricao: null, preco_kg: null, ...dados });

    return { id_produto: Number(resultado.lastInsertRowid), ativo: 1, ...dados };
  },

  inativar: (id: number): void => {
    db.prepare("UPDATE Produto SET ativo = 0 WHERE id_produto = ?").run(id);
  },
};