import { clienteRepository } from "../repositories/cliente.repository";
import type { Cliente } from "../schemas/cliente.schema";

export const clienteService = {

  listar: (): Cliente[] => {
    return clienteRepository.listarTodos();
  },

  buscarPorId: (id: number): Cliente => {
    const cliente = clienteRepository.buscarPorId(id);
    if (!cliente) throw new Error("Cliente não encontrado");
    return cliente;
  },

  criar: (dados: Omit<Cliente, "id_cliente" | "data_cadastro">): Cliente => {
    return clienteRepository.criar(dados);
  },

  atualizar: (id: number, dados: Partial<Omit<Cliente, "id_cliente" | "data_cadastro">>): Cliente => {
    clienteService.buscarPorId(id);
    clienteRepository.atualizar(id, dados);
    return clienteService.buscarPorId(id);
  },

  deletar: (id: number): void => {
    clienteService.buscarPorId(id);
    clienteRepository.deletar(id);
  },
};