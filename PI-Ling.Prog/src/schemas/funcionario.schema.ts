import { z } from "zod";
// Murilo aqui! Fiz umas alterações aqui para deixar os campos condizentes com o que está no banco de dados, como nome e telefone
export const FuncionarioSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  telefone: z.string().min(1, "Telefone obrigatório"),
  cargo: z.string().min(2, "Cargo obrigatório"),
  ativo: z.number().int().min(0).max(1).default(1),
  data_admissao: z.string().min(1, "Adicione a data de admissão"),
});

export type Funcionario = z.infer<typeof FuncionarioSchema> & {
  id_funcionario: number;
};