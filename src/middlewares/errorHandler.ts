// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const ts = new Date().toISOString();

  if (err instanceof ZodError) {
    res.status(400).json({
      status: "error",
      code: "VALIDATION_ERROR",
      message: "Datos de entrada inválidos.",
      errors: err.errors.map((e) => ({
        campo: e.path.join("."),
        mensaje: e.message,
      })),
      timestamp: ts,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      code: err.code,
      message: err.message,
      timestamp: ts,
    });
    return;
  }

  logger.error("Error no controlado:", {
    message: err.message,
    stack: err.stack,
  });
  res.status(500).json({
    status: "error",
    code: "INTERNAL_ERROR",
    message: "Error interno del servidor.",
    timestamp: ts,
  });
}
