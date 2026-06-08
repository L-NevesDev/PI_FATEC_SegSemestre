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

  atualizar: (id: number, dados: Partial<Omit<Estoque, "id_estoque">>): void => {
    db.prepare(`
      UPDATE Estoque SET
        id_produto             = COALESCE(@id_produto,             id_produto),
        quantidade_disponivel  = COALESCE(@quantidade_disponivel,  quantidade_disponivel),
        data_producao          = COALESCE(@data_producao,          data_producao),
        data_validade          = COALESCE(@data_validade,          data_validade),
        lote                   = COALESCE(@lote,                   lote)
      WHERE id_estoque = @id
    `).run({ id_produto: null, quantidade_disponivel: null, data_producao: null, data_validade: null, lote: null, ...dados, id });
  },

  deletar: (id: number): void => {
    db.prepare("DELETE FROM Estoque WHERE id_estoque = ?").run(id);
  },

  proximosDoVencimento: (dias: number): Estoque[] => {
    return db.prepare(`
      SELECT e.*, p.nome_produto FROM Estoque e
      JOIN Produto p ON p.id_produto = e.id_produto
      WHERE date(e.data_validade) <= date('now', '+' || ? || ' days')
        AND e.quantidade_disponivel > 0
    `).all(dias) as Estoque[];
  },
};