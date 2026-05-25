import { z } from "zod";

export const ClienteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  telefone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional(),
  endereco: z.string().optional(),
});

export type Cliente = z.infer<typeof ClienteSchema> & {
  id_cliente: number;
  data_cadastro: string;
};