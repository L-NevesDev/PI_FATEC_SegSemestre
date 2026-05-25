import { z } from "zod";

export const UsuarioSchema = z.object({
  id_funcionario: z.number().int().positive(),
  usuario: z.string().min(3, "Usuário deve ter ao menos 3 caracteres"),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  nivel_acesso: z.enum(["admin", "funcionario"]).refine(
  val => ["admin", "funcionario"].includes(val),
  { message: "Nível deve ser 'admin' ou 'funcionario'" }
),
});

export const LoginSchema = z.object({
  usuario: z.string(),
  senha: z.string(),
});

export type UsuarioPublico = {
  id_usuario: number;
  id_funcionario: number;
  usuario: string;
  nivel_acesso: string;
  ultimo_login: string | null;
};