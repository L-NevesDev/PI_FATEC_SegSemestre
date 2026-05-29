import db from "../database/connection";
import type { Cliente, ClienteSchema } from "../schemas/cliente.schema";

export const clienteRepository = {

  listarTodos: (): Cliente[] => {
    return db.prepare("SELECT * FROM Cliente ORDER BY nome").all() as Cliente[];
  },

  buscarPorId: (id: number): Cliente | undefined => {
    return db.prepare(
      "SELECT * FROM Cliente WHERE id_cliente = ?"
    ).get(id) as Cliente | undefined;
  },

  criar: (dados: Omit<Cliente, "id_cliente" | "data_cadastro">): Cliente => {
    const data_cadastro = new Date().toISOString().substring(0, 10);
    const resultado = db.prepare(`
      INSERT INTO Cliente (nome, cpf, telefone, email, endereco, data_cadastro)
      VALUES (@nome, @cpf, @telefone, @email, @endereco, @data_cadastro)
    `).run({ ...dados, data_cadastro });

    return { id_cliente: Number(resultado.lastInsertRowid), data_cadastro, ...dados };
  },

  atualizar: (id: number, dados: Partial<Omit<Cliente, "id_cliente" | "data_cadastro">>): void => {
    db.prepare(`
      UPDATE Cliente SET
        nome     = COALESCE(@nome,     nome),
        cpf      = COALESCE(@cpf,      cpf),
        telefone = COALESCE(@telefone, telefone),
        email    = COALESCE(@email,    email),
        endereco = COALESCE(@endereco, endereco)
      WHERE id_cliente = @id
    `).run({ ...dados, id });
  },

  deletar: (id: number): boolean => {
    const resultado = db.prepare(
      "DELETE FROM Cliente WHERE id_cliente = ?"
    ).run(id);
    return resultado.changes > 0;
  },
};