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

  atualizar: (id: number, dados: Partial<Omit<Produto, "id_produto">>): Produto => {
    produtoService.buscarPorId(id); // garante que existe
    produtoRepository.atualizar(id, dados);
    return produtoService.buscarPorId(id);
  },

  inativar: (id: number): void => {
    produtoService.buscarPorId(id);
    produtoRepository.inativar(id);
  },
};
