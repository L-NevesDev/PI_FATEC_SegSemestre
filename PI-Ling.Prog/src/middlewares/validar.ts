import { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";

export const validar = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({ erro: "Dados inválidos", detalhes: error.errors });
    }
  };
};