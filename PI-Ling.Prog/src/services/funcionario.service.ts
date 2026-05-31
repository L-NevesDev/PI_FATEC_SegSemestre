import { funcionarioRepository } from "../repositories/funcionario.repository";
import type { Funcionario, FuncionarioInput } from "../schemas/funcionario.schema";
import { AppError } from "../middlewares/errorHandler";

export const funcionarioService = {

  listar: (): Funcionario[] => {
    return funcionarioRepository.listarTodos();
  },

  buscarPorId: (id: number): Funcionario => {
    const funcionario = funcionarioRepository.buscarPorId(id);
    if (!funcionario) throw new AppError(404, "Funcionário não encontrado");
    return funcionario;
  },

  criar: (dados: FuncionarioInput): Funcionario => {
    return funcionarioRepository.criar(dados);
  },

  atualizar: (id: number, dados: Partial<Omit<Funcionario, "id_funcionario">>): Funcionario => {
    funcionarioService.buscarPorId(id);
    funcionarioRepository.atualizar(id, dados);
    return funcionarioService.buscarPorId(id);
  },

  inativar: (id: number): void => {
    funcionarioService.buscarPorId(id);
    funcionarioRepository.inativar(id);
  },
};