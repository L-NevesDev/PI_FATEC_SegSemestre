import { z } from "zod";

export const FuncionarioSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  telefone: z.string().optional(),
  cargo: z.string().min(2, "Cargo obrigatório"),
  ativo: z.number().int().min(0).max(1).default(1),
  data_admissao: z.string(),
});

export type Funcionario = z.infer<typeof FuncionarioSchema> & {
  id_funcionario: number;
};