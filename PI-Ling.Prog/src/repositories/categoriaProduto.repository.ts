import db from "../database/connection";
import type { CategoriaProduto } from "../schemas/categoriaProduto.schema";

export const categoriaProdutoRepository = {

  listarTodas: (): CategoriaProduto[] => {
    return db.prepare("SELECT * FROM CategoriaProduto ORDER BY nome").all() as CategoriaProduto[];
  },

  buscarPorId: (id: number): CategoriaProduto | undefined => {
    return db.prepare(
      "SELECT * FROM CategoriaProduto WHERE id_categoria = ?"
    ).get(id) as CategoriaProduto | undefined;
  },

  criar: (dados: Omit<CategoriaProduto, "id_categoria">): CategoriaProduto => {
    const resultado = db.prepare(`
      INSERT INTO CategoriaProduto (nome, descricao)
      VALUES (@nome, @descricao)
    `).run(dados);
    return { id_categoria: Number(resultado.lastInsertRowid), ...dados };
  },

  atualizar: (id: number, dados: Partial<Omit<CategoriaProduto, "id_categoria">>): void => {
    db.prepare(`
      UPDATE CategoriaProduto SET
        nome      = COALESCE(@nome, nome),
        descricao = COALESCE(@descricao, descricao)
      WHERE id_categoria = @id
    `).run({ ...dados, id });
  },

  deletar: (id: number): boolean => {
    // banco tem ON DELETE RESTRICT — se tiver produto vinculado a essa categoria, o SQLite vai rejeitar a exclusão
    try {
      const resultado = db.prepare(
        "DELETE FROM CategoriaProduto WHERE id_categoria = ?"
      ).run(id);
      return resultado.changes > 0;
    } catch {
      throw new Error("Não é possível excluir: existem produtos nessa categoria");
    }
  },
};