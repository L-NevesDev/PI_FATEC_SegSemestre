import db from "../database/connection";
// Lucas: removido "ClienteSchema" do import — é um objeto Zod, não um tipo, e não era usado no repository
import type { Cliente } from "../schemas/cliente.schema";

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
    // Lucas: adicionado "email: null" como default antes do spread para evitar "Missing named parameter"
    // do better-sqlite3 quando o campo opcional "email" não é enviado na requisição
    const resultado = db.prepare(`
      INSERT INTO Cliente (nome, cpf, telefone, email, endereco, data_cadastro)
      VALUES (@nome, @cpf, @telefone, @email, @endereco, @data_cadastro)
    `).run({ email: null, ...dados, data_cadastro });

    return { id_cliente: Number(resultado.lastInsertRowid), data_cadastro, ...dados };
  },

  atualizar: (id: number, dados: Partial<Omit<Cliente, "id_cliente" | "data_cadastro">>): void => {
    // Lucas: adicionado defaults null para todos os campos antes do spread — evita "Missing named parameter"
    // do better-sqlite3 em updates parciais (PUT com apenas alguns campos preenchidos)
    db.prepare(`
      UPDATE Cliente SET
        nome     = COALESCE(@nome,     nome),
        cpf      = COALESCE(@cpf,      cpf),
        telefone = COALESCE(@telefone, telefone),
        email    = COALESCE(@email,    email),
        endereco = COALESCE(@endereco, endereco)
      WHERE id_cliente = @id
    `).run({ nome: null, cpf: null, telefone: null, email: null, endereco: null, ...dados, id });
  },

  deletar: (id: number): boolean => {
    const resultado = db.prepare(
      "DELETE FROM Cliente WHERE id_cliente = ?"
    ).run(id);
    return resultado.changes > 0;
  },
};