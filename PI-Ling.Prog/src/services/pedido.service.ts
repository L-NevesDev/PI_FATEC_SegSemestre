import { pedidoRepository } from "../repositories/pedido.repository";
import type { PedidoInput } from "../schemas/pedido.schema";

const STATUS_VALIDOS = ["PENDENTE", "EM_PRODUCAO", "PRONTO", "ENTREGUE", "CANCELADO"];

export const pedidoService = {

  listar: () => {
    return pedidoRepository.listarTodos();
  },

  buscarPorId: (id: number) => {
    const pedido = pedidoRepository.buscarPorId(id);
    if (!pedido) throw new Error("Pedido não encontrado");
    return pedido;
  },

  criar: (dados: PedidoInput) => {
    return pedidoRepository.criar(dados);
  },

  // só permite transições de status válidas
  atualizarStatus: (id: number, novoStatus: string) => {
    if (!STATUS_VALIDOS.includes(novoStatus)) {
      throw new Error(`Status inválido. Use: ${STATUS_VALIDOS.join(", ")}`);
    }
    pedidoService.buscarPorId(id); // verifica se existe
    pedidoRepository.atualizarStatus(id, novoStatus);
    return pedidoService.buscarPorId(id);
  },
};