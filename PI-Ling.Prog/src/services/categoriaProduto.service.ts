import { categoriaProdutoRepository } from "../repositories/categoriaProduto.repository";
import type { CategoriaProduto } from "../schemas/categoriaProduto.schema";

export const categoriaProdutoService = {

  listar: (): CategoriaProduto[] => {
    return categoriaProdutoRepository.listarTodas();
  },

  buscarPorId: (id: number): CategoriaProduto => {
    const cat = categoriaProdutoRepository.buscarPorId(id);
    if (!cat) throw new Error("Categoria não encontrada");
    return cat;
  },

  criar: (dados: Omit<CategoriaProduto, "id_categoria">): CategoriaProduto => {
    return categoriaProdutoRepository.criar(dados);
  },

  atualizar: (id: number, dados: Partial<Omit<CategoriaProduto, "id_categoria">>): CategoriaProduto => {
    categoriaProdutoService.buscarPorId(id);
    categoriaProdutoRepository.atualizar(id, dados);
    return categoriaProdutoService.buscarPorId(id);
  },

  deletar: (id: number): void => {
    categoriaProdutoService.buscarPorId(id);
    categoriaProdutoRepository.deletar(id);
  },
};