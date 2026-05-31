import { produtoRepository } from "../repositories/produto.repository";
import type { Produto } from "../schemas/produto.schema";

export const produtoService = {

  listar: (): Produto[] => {
    return produtoRepository.listarTodos();
  },

  buscarPorId: (id: number): Produto => {
    const produto = produtoRepository.buscarPorId(id);
    if (!produto) throw new Error("Produto não encontrado");
    return produto;
  },

  criar: (dados: Omit<Produto, "id_produto" | "ativo">): Produto => {
    return produtoRepository.criar(dados);
  },

  inativar: (id: number): void => {
    produtoService.buscarPorId(id);
    produtoRepository.inativar(id);
  },
};