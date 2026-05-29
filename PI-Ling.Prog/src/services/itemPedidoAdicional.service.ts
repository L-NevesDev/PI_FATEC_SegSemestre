/*Jefferson - Criação services padrão para item pedido Pedido adicional
*/
import { itemPedidoAdicionalRepository } from "../repositories/itemPedidoAdicional.repository";
import type { ItemPedidoAdicional } from "../schemas/itemPedidoAdicional.schema";

export const itemPedidoAdicionalService = {

  listarPorItem: (id_item_pedido: number): ItemPedidoAdicional[] => {
    return itemPedidoAdicionalRepository.listarPorItem(id_item_pedido);
  },

  buscarPorId: (id: number): ItemPedidoAdicional => {
    const adicional = itemPedidoAdicionalRepository.buscarPorId(id);
    if (!adicional) throw new Error("Adicional não encontrado");
    return adicional;
  },

  criar: (dados: Omit<ItemPedidoAdicional, "id_item_adicional">): ItemPedidoAdicional => {
    return itemPedidoAdicionalRepository.criar(dados);
  },

  deletar: (id: number): void => {
    itemPedidoAdicionalService.buscarPorId(id); //garantia que existe
    itemPedidoAdicionalRepository.deletar(id);
  },
};