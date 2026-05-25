import { funcionarioRepository } from "../repositories/funcionario.repository";
import type { Funcionario } from "../schemas/funcionario.schema";

export const funcionarioService = {

  listar: (): Funcionario[] => {
    return funcionarioRepository.listarTodos();
  },

  buscarPorId: (id: number): Funcionario => {
    const funcionario = funcionarioRepository.buscarPorId(id);
    if (!funcionario) throw new Error("Funcionário não encontrado");
    return funcionario;
  },

  criar: (dados: Omit<Funcionario, "id_funcionario">): Funcionario => {
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
    //não deletamos funcionários, apenas inativamos
  },
};