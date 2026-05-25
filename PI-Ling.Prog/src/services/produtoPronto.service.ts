import { produtoProntoRepository } from "../repositories/produtoPronto.repository";
import type { ProdutoPronto } from "../schemas/produtoPronto.schema";

export const produtoProntoService = {

  listarDisponiveis: (): ProdutoPronto[] => {
    return produtoProntoRepository.listarDisponiveis();
  },

  buscarPorId: (id: number): ProdutoPronto => {
    const item = produtoProntoRepository.buscarPorId(id);
    if (!item) throw new Error("Produto pronto não encontrado");
    return item;
  },

  // Registrar um produto pronto para venda (vem do estoque)
  registrar: (dados: Omit<ProdutoPronto, "id_produto_pronto">): ProdutoPronto => {
    return produtoProntoRepository.criar(dados);
  },

  // Retirar de venda (ex: venceu, danificou)
  retirarDeVenda: (id: number): void => {
    produtoProntoService.buscarPorId(id);
    produtoProntoRepository.atualizarDisponibilidade(id, 0);
  },
};