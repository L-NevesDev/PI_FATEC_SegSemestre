import { z } from "zod";

export const EstoqueSchema = z.object({
  id_produto: z.number().int().positive(),
  quantidade_disponivel: z.number().int().positive("Quantidade deve ser positiva"),
  data_producao: z.string(),
  data_validade: z.string(),
  lote: z.string().min(1),
});

export type Estoque = z.infer<typeof EstoqueSchema> & { id_estoque: number };