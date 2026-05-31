import db from "../database/connection";
import type { Funcionario } from "../schemas/funcionario.schema";
import { AppError, errorHandler } from "../middlewares/errorHandler";
import { error } from "node:console";

// Murilo aqui! Alterei as querys e deixei elas separadas para que elas sejam preparadas apenas uma vez quando o server iniciar
// Alterei também as operações do repository com o return de statements
// Adicionado busca por emial nas querys e operações
const statements = {
  listarTodos: db.prepare("SELECT * FROM Funcionario WHERE ativo = 1"),
  buscarPorId: db.prepare("SELECT * FROM Funcionario WHERE id_funcionario = ?"),
  buscarPorEmail: db.prepare("SELECT * FROM Funcionario WHERE email = ?"),
  criar: db.prepare(`
    INSERT INTO Funcionario (nome, telefone, cargo, ativo, data_admissao)
    VALUES (@nome, @telefone, @cargo, @ativo, @data_admissao)`),

    atualizar: db.prepare(`
      UPDATE Funcionario SET
      nome = COALESCE(@nome, nome),
      telefone = COALESCE(@telefone, telefone),
      email = COALESCE(@email, email),
      cargo = COALESCE(@cargo, cargo),
      ativo = COALESCE(@ativo, ativo)
      WHERE id_funcionario = @id)
      `),
      inativar: db.prepare("UPDATE Funcionario SET ativo = 0 WHERE id_funcionario = ?"),
};

export const funcionarioRepository = {

  listarTodos: (): Funcionario[] => {
    return statements.listarTodos.all() as Funcionario[];
  },

  buscarPorId: (id: number): Funcionario | undefined => {
    return statements.buscarPorId.get(id) as Funcionario | undefined;
  },

  buscarPorEmail: (email: string): Funcionario | undefined => {
  return statements.buscarPorEmail.get(email) as Funcionario | undefined;
},

  criar: (dados: Omit<Funcionario, "id_funcionario">): Funcionario => {
    const resultado = statements.criar.run(dados);
    return { id_funcionario: Number(resultado.lastInsertRowid), ...dados };
  },

  atualizar: (id: number, dados: Partial<Omit<Funcionario, "id_funcionario">>): void => {
    const resultado = statements.atualizar.run({ ...dados, id });

    if (resultado.changes === 0) {
      throw new AppError(400, "Funcionário não encontrado");
    }
  },

  inativar: (id: number): void => {
   const resultado = statements.inativar.run(id);

   if(resultado.changes === 0) {
    throw new AppError(404, "Funcionário não encontrado");
   }
  },
};