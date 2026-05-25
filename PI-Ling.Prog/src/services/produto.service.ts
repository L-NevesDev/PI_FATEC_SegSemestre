import { produtoRepository } from "../repositories/produto.repository";
import type { Produto } from "../schemas/produto.schema";

export const produtoService = {

  listar: (): Produto[] => {
    return produtoRepository.listarTodos();
  },

  buscarPorId: (id: number) => {
    const produto = produtoRepository.buscarPorId(id);
    if (!produto) throw new Error("Produto não encontrado");

    // Monta o objeto completo com recheios e coberturas
    return {
      ...produto,
      recheios: produtoRepository.buscarRecheiosDoProduto(id),
      coberturas: produtoRepository.buscarCoberturasDoProduto(id),
    };
  },

  criar: (dados: Omit<Produto, "id_produto" | "ativo"> & { recheios?: number[]; coberturas?: number[] }): Produto => {
    const { recheios = [], coberturas = [], ...dadosProduto } = dados;
    return produtoRepository.criar(dadosProduto, recheios, coberturas);
  },

  inativar: (id: number): void => {
    produtoService.buscarPorId(id); // verifica se existe
    produtoRepository.inativar(id);
  },
};