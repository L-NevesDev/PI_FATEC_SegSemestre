import db from "../database/connection";
import bcrypt from "bcrypt";
import type { Funcionario, FuncionarioInput } from "../schemas/funcionario.schema";

const COLUNAS_PUBLICAS = "id_funcionario, nome, email, data_admissao, cargo, telefone, ativo";

export const funcionarioRepository = {

  listarTodos: (): Funcionario[] => {
    return db.prepare(
      `SELECT ${COLUNAS_PUBLICAS} FROM Funcionario WHERE ativo = 1`
    ).all() as Funcionario[];
  },

  buscarPorId: (id: number): Funcionario | undefined => {
    return db.prepare(
      `SELECT ${COLUNAS_PUBLICAS} FROM Funcionario WHERE id_funcionario = ?`
    ).get(id) as Funcionario | undefined;
  },

  criar: (dados: FuncionarioInput): Funcionario => {
    const { senha, ...dadosPublicos } = dados;
    const senha_hash = bcrypt.hashSync(senha, 10);

    const resultado = db.prepare(`
      INSERT INTO Funcionario (nome, email, senha_hash, data_admissao, cargo, telefone, ativo)
      VALUES (@nome, @email, @senha_hash, @data_admissao, @cargo, @telefone, @ativo)
    `).run({ ...dadosPublicos, senha_hash });

    return { id_funcionario: Number(resultado.lastInsertRowid), ...dadosPublicos };
  },

  atualizar: (id: number, dados: Partial<Omit<Funcionario, "id_funcionario">>): void => {
    db.prepare(`
      UPDATE Funcionario SET
        nome     = COALESCE(@nome,     nome),
        email    = COALESCE(@email,    email),
        telefone = COALESCE(@telefone, telefone),
        cargo    = COALESCE(@cargo,    cargo),
        ativo    = COALESCE(@ativo,    ativo)
      WHERE id_funcionario = @id
    `).run({ nome: null, email: null, telefone: null, cargo: null, ativo: null, ...dados, id });
  },

  inativar: (id: number): void => {
    db.prepare(
      "UPDATE Funcionario SET ativo = 0 WHERE id_funcionario = ?"
    ).run(id);
  },
};