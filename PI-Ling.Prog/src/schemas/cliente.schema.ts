import { z } from "zod";

// Lucas:
// Foi adicionado o campo "cpf";
// Foi refatorado o telefone para conter somente numeros;
// O campo "email" foi trasnformado em opcional.

export const ClienteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  cpf: z.string()
    .length(11, "CPF deve ter 11 dígitos")
    .regex(/^\d+$/, { message: "CPF deve conter apenas números" }),
  telefone: z.string()
    .min(10, "Telefone deve ter no mínimo 10 dígitos (incluindo DDD)")
    .max(12, "Telefone deve ter no máximo 12 dígitos (incluindo DDD)")
    .regex(/^\d+$/, { message: "Telefone deve conter apenas números" }),
  email: z.string().email("E-mail inválido").optional(),
  endereco: z.string().min(5, "Endereço deve ter ao menos 5 caracteres"),
});

export type Cliente = z.infer<typeof ClienteSchema> & {
  id_cliente: number;
  data_cadastro: string;
};