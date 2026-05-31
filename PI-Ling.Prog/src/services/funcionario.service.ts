import { funcionarioRepository } from "../repositories/funcionario.repository";
import type { Funcionario, FuncionarioInput } from "../schemas/funcionario.schema";
import { AppError } from "../middlewares/errorHandler";
import bcrypt from "bcrypt"
import id from "zod/v4/locales/id.js";

export const funcionarioService = {

  listar: (): Funcionario[] => {
    return funcionarioRepository.listarTodos();
  },

  buscarPorId: (id: number): Funcionario => {
    const funcionario = funcionarioRepository.buscarPorId(id);
    if (!funcionario) throw new AppError(404, "Funcionário não encontrado");
    return funcionario;
  },
// Murilo aqui! Fiz uma alteração pois na hora de criar o funcionário, ele não reclamava caso o email cadastrado fosse igual ao de outro funcionário
  criar: (dados: FuncionarioInput): Funcionario => {
    const emailExiste = funcionarioRepository.buscarPorEmail(dados.email);
    if (emailExiste) throw new AppError(409, "Email já cadastrado");

    const senhaHash = bcrypt.hashSync(dados.senha, 10);
    return funcionarioRepository.criar({ ...dados, senha: senhaHash});
  },

  atualizar: (id: number, dados: Partial<Omit<Funcionario, "id_funcionario">>): Funcionario => {
    funcionarioRepository.atualizar(id, dados);
    return funcionarioService.buscarPorId(id);
  },

  inativar: (id: number): void => {
    funcionarioRepository.inativar(id);
  },
};