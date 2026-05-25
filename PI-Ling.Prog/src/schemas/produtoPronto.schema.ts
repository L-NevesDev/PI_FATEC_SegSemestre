import { z } from "zod";

export const ProdutoProntoSchema = z.object({
  id_estoque: z.number().int().positive(),
  quantidade: z.number().int().positive("Quantidade deve ser positiva"),
  disponivel_venda: z.number().int().min(0).max(1).default(1),
});

export type ProdutoPronto = z.infer<typeof ProdutoProntoSchema> & {
  id_produto_pronto: number;
};