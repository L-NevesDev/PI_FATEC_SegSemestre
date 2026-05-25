import { z } from "zod";

export const ProdutoSchema = z.object({
  id_categoria: z.number().int().positive(),
  nome_produto: z.string().min(2),
  descricao: z.string().optional(),
  preco_base: z.number().positive("Preço deve ser positivo"),
  preco_kg: z.number().positive().optional(),
  quantidade_fatias: z.number().int().positive().optional(),
  recheios: z.array(z.number().int()).optional(),   // IDs dos recheios
  coberturas: z.array(z.number().int()).optional(), // IDs das coberturas
});

export type Produto = z.infer<typeof ProdutoSchema> & {
  id_produto: number;
  ativo: number;
};

// Schema separado para Recheio e Cobertura
export const RecheioSchema = z.object({
  nome_recheio: z.string().min(2),
  valor_adicional: z.number().default(0),
});
export type Recheio = z.infer<typeof RecheioSchema> & { id_recheio: number };

export const CoberturaSchema = z.object({
  nome_cobertura: z.string().min(2),
  valor_adicional: z.number().default(0),
});
export type Cobertura = z.infer<typeof CoberturaSchema> & { id_cobertura: number };