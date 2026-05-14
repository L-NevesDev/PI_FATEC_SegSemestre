import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export const validar = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({ erro: "Dados inválidos", detalhes: error.errors });
    }
  };
};