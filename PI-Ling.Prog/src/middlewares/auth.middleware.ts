import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "sabor_magia_jwt_secret_2025";

export interface UsuarioToken {
  id_funcionario: number;
  nome: string;
  perfil: "admin" | "funcionario";
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioToken;
    }
  }
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as UsuarioToken;
    req.usuario = payload;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}

export function apenasAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.usuario || req.usuario.perfil !== "admin") {
    return res.status(403).json({ erro: "Acesso restrito a administradores" });
  }
  next();
}
