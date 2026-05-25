import bcrypt from "bcrypt";
import { usuarioRepository } from "../repositories/usuario.repository";
import type { UsuarioPublico } from "../schemas/usuario.schema";

export const usuarioService = {

  // Cria um novo usuário — criptografa a senha antes de salvar
  criar: async (dados: {
    id_funcionario: number;
    usuario: string;
    senha: string;
    nivel_acesso: string;
  }): Promise<UsuarioPublico> => {
    // NUNCA salve a senha em texto puro — o bcrypt gera um hash seguro
    const senha_hash = await bcrypt.hash(dados.senha, 10);

    return usuarioRepository.criar({
      id_funcionario: dados.id_funcionario,
      usuario: dados.usuario,
      senha_hash,
      nivel_acesso: dados.nivel_acesso,
    });
  },

  // Faz login — compara a senha enviada com o hash salvo
  login: async (usuario: string, senha: string): Promise<UsuarioPublico> => {
    const user = usuarioRepository.buscarPorUsuario(usuario);

    // Mesma mensagem para usuário errado e senha errada — não revela o que falhou
    if (!user) throw new Error("Usuário ou senha inválidos");

    const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaCorreta) throw new Error("Usuário ou senha inválidos");

    usuarioRepository.registrarLogin(user.id_usuario);

    // Remove o hash antes de retornar
    const { senha_hash, ...dadosSeguros } = user;
    return dadosSeguros;
  },
};