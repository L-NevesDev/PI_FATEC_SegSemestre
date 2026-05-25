import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const validar = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ← Antes: só validava e jogava fora o resultado
      // ← Agora: salva o resultado parseado (com defaults aplicados) de volta
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({ erro: "Dados inválidos", detalhes: error.errors });
    }
  };
};