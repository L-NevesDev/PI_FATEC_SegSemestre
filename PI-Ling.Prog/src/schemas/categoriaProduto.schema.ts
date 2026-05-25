import { z } from "zod";

export const CategoriaProdutoSchema = z.object({
  nome: z.string().min(2, "Nome da categoria obrigatório"),
  descricao: z.string().optional(),
});

export type CategoriaProduto = z.infer<typeof CategoriaProdutoSchema> & {
  id_categoria: number;
};