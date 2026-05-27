//Lucas fez esta parte
//Fiz algumas alterações para validar o telefone,
//Agora o telefone é uma string OBRIGATÓRIA,
//com um mínimo de 10 caracteres (incluindo DDD) e um máximo de 12 caracteres (incluindo DDD),
//e deve conter apenas números (sem espaços, traços ou parênteses).

import { z } from "zod";

export const ClienteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  telefone: z.string("Telefone é Obrigatório")
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