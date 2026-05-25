import { estoqueRepository } from "../repositories/estoque.repository";
import type { Estoque } from "../schemas/estoque.schema";

export const estoqueService = {

  listar: (): Estoque[] => {
    return estoqueRepository.listarTodos();
  },

  buscarPorId: (id: number): Estoque => {
    const item = estoqueRepository.buscarPorId(id);
    if (!item) throw new Error("Item de estoque não encontrado");
    return item;
  },

  adicionar: (dados: Omit<Estoque, "id_estoque">): Estoque => {
    return estoqueRepository.criar(dados);
  },

  //alerta produtos próximos do vencimento (padrão: 3 dias)
  alertarVencimento: (dias: number = 3): Estoque[] => {
    return estoqueRepository.proximosDoVencimento(dias);
  },
};