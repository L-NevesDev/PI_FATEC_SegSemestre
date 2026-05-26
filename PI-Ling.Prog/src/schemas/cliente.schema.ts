import { z } from "zod";

export const ClienteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  
    telefone: z.string()
    .nonempty("Telefone é obrigatório")
    .min(10, "Telefone deve ter no mínimo 12 caracteres (incluindo DDD)")
    .max(12, "Telefone deve ter no máximo 15 caracteres (incluindo DDD)")
    .regex(/^\d+$/, "Telefone deve conter apenas números"),
  email: z.string().email("E-mail inválido").optional(),
  endereco: z.string().optional(),
});

export type Cliente = z.infer<typeof ClienteSchema> & {
  id_cliente: number;
  data_cadastro: string;
};