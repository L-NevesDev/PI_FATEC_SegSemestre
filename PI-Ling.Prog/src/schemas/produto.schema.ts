import { z } from "zod";

export const ProdutoSchema = z.object({
  id_categoria: z.number().int().positive(),
  nome_produto: z.string().min(2),
  descricao: z.string().optional(),
  preco_base: z.number().positive("Preço deve ser positivo"),
  preco_kg: z.number().positive().optional(),
});

export type Produto = z.infer<typeof ProdutoSchema> & {
  id_produto: number;
  ativo: number;
};