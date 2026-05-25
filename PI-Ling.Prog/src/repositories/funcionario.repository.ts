import db from "../database/connection";
import type { Funcionario } from "../schemas/funcionario.schema";

export const funcionarioRepository = {

  listarTodos: (): Funcionario[] => {
    return db.prepare("SELECT * FROM Funcionario WHERE ativo = 1").all() as Funcionario[];
  },

  buscarPorId: (id: number): Funcionario | undefined => {
    return db.prepare(
      "SELECT * FROM Funcionario WHERE id_funcionario = ?"
    ).get(id) as Funcionario | undefined;
  },

  criar: (dados: Omit<Funcionario, "id_funcionario">): Funcionario => {
    const resultado = db.prepare(`
      INSERT INTO Funcionario (nome, telefone, cargo, ativo, data_admissao)
      VALUES (@nome, @telefone, @cargo, @ativo, @data_admissao)
    `).run(dados);
    return { id_funcionario: Number(resultado.lastInsertRowid), ...dados };
  },

  atualizar: (id: number, dados: Partial<Omit<Funcionario, "id_funcionario">>): void => {
    db.prepare(`
      UPDATE Funcionario SET
        nome          = COALESCE(@nome, nome),
        telefone      = COALESCE(@telefone, telefone),
        cargo         = COALESCE(@cargo, cargo),
        ativo         = COALESCE(@ativo, ativo)
      WHERE id_funcionario = @id
    `).run({ ...dados, id });
  },

  inativar: (id: number): void => {
    // Não deletamos funcionário — só marcamos como inativo
    db.prepare(
      "UPDATE Funcionario SET ativo = 0 WHERE id_funcionario = ?"
    ).run(id);
  },
};