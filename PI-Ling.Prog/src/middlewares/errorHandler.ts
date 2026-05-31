import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERRO]: ${err.message}`);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message });
  }

  if (err.message.includes("UNIQUE constraint failed")) {
    return res.status(409).json({ erro: "Registro duplicado", detalhe: err.message });
  }

  if (err.message.includes("FOREIGN KEY constraint failed")) {
    return res.status(400).json({ erro: "Referência inválida", detalhe: err.message });
  }

  res.status(500).json({ erro: "Erro interno do servidor" });
};