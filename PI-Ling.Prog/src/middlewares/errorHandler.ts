import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERRO]: ${err.message}`);
  res.status(500).json({ erro: "Erro interno do servidor" });
};