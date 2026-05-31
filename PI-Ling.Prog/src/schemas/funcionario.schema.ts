import { z } from "zod";

export const FuncionarioSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  telefone: z.string().min(1, "Telefone obrigatório"),
  cargo: z.string().min(2, "Cargo obrigatório"),
  ativo: z.number().int().min(0).max(1).default(1),
  data_admissao: z.string().min(1, "Adicione a data de admissão"),
});

export type FuncionarioInput = z.infer<typeof FuncionarioSchema>;

export type Funcionario = Omit<FuncionarioInput, "senha"> & {
  id_funcionario: number;
};