import db from "../database/connection";
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

  criar: (dados: Omit<Cliente, "id_cliente">): Cliente => {
    const resultado = db.prepare(`
      INSERT INTO Cliente (nome, telefone, email, endereco, data_cadastro)
      VALUES (@nome, @telefone, @email, @endereco, @data_cadastro)
    `).run(dados);

    // ID gerado pelo banco (AUTOINCREMENT)
    return { id_cliente: Number(resultado.lastInsertRowid), ...dados };
  },

  atualizar: (id: number, dados: Partial<Omit<Cliente, "id_cliente">>): void => {
    // COALESCE: "use o novo valor, mas se vier vazio, mantém o antigo"
    db.prepare(`
      UPDATE Cliente SET
        nome     = COALESCE(@nome,     nome),
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
    return resultado.changes > 0; // .changes = quantas linhas foram afetadas
  },
};