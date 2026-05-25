import { clienteRepository } from "../repositories/cliente.repository";
import type { Cliente } from "../schemas/cliente.schema";

export const clienteService = {

  listar: (): Cliente[] => {
    return clienteRepository.listarTodos();
  },

  buscarPorId: (id: number): Cliente => {
    const cliente = clienteRepository.buscarPorId(id);
    // erro se não encontrar (o repository só retorna undefined)
    if (!cliente) throw new Error("Cliente não encontrado");
    return cliente;
  },

  criar: (dados: Omit<Cliente, "id_cliente" | "data_cadastro">): Cliente => {
    return clienteRepository.criar({
      ...dados,
      data_cadastro: new Date().toISOString(), // data gerada aqui
    });
  },

  atualizar: (id: number, dados: Partial<Omit<Cliente, "id_cliente" | "data_cadastro">>): Cliente => {
    clienteService.buscarPorId(id); // garante que existe antes de atualizar
    clienteRepository.atualizar(id, dados);
    return clienteService.buscarPorId(id); // retorna o registro atualizado
  },

  deletar: (id: number): void => {
    clienteService.buscarPorId(id); // garante que existe antes de deletar
    clienteRepository.deletar(id);
  },
};