import db from "../database/connection";
import type { UsuarioPublico } from "../schemas/usuario.schema";

export const usuarioRepository = {

  buscarPorUsuario: (usuario: string) => {
    // Retorna COM senha_hash — só usar internamente para validar login
    return db.prepare(
      "SELECT * FROM Usuario WHERE usuario = ?"
    ).get(usuario) as (UsuarioPublico & { senha_hash: string }) | undefined;
  },

  buscarPorId: (id: number): UsuarioPublico | undefined => {
    // Retorna SEM senha_hash — seguro para expor na API
    return db.prepare(`
      SELECT id_usuario, id_funcionario, usuario, nivel_acesso, ultimo_login
      FROM Usuario WHERE id_usuario = ?
    `).get(id) as UsuarioPublico | undefined;
  },

  criar: (dados: {
    id_funcionario: number;
    usuario: string;
    senha_hash: string;
    nivel_acesso: string;
  }): UsuarioPublico => {
    const resultado = db.prepare(`
      INSERT INTO Usuario (id_funcionario, usuario, senha_hash, nivel_acesso)
      VALUES (@id_funcionario, @usuario, @senha_hash, @nivel_acesso)
    `).run(dados);

    return db.prepare(`
      SELECT id_usuario, id_funcionario, usuario, nivel_acesso, ultimo_login
      FROM Usuario WHERE id_usuario = ?
    `).get(resultado.lastInsertRowid) as UsuarioPublico;
  },

  registrarLogin: (id_usuario: number): void => {
    db.prepare(
      "UPDATE Usuario SET ultimo_login = ? WHERE id_usuario = ?"
    ).run(new Date().toISOString(), id_usuario);
  },
};