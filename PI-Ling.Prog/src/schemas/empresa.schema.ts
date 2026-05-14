import { z } from "zod";

export const EmpresaSchema = z.object({
  cnpj: z.string().length(14, "O CNPJ deve ter 14 dígitos sem pontuação"),
  razaoSocial: z.string().min(3, "Razão Social deve ter no mínimo 3 caracteres"),
  regimeTributario: z.enum(["Simples Nacional", "Lucro Presumido", "Lucro Real"]),
  cnae: z.string().min(5, "CNAE inválido")
});

// Extrai o tipo TypeScript a partir do Schema do Zod
export type Empresa = z.infer<typeof EmpresaSchema> & { id: string };