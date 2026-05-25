// src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import {
  verificarAccessToken,
  tokenEstaInvalidado,
  JwtPayload,
} from "../services/authService";
import { UsuarioRol } from "../models/Usuario";

declare global {
  namespace Express {
    interface Request {
      usuario?: JwtPayload;
    }
  }
}

const json401 = (res: Response, code: string, message: string) =>
  res.status(401).json({
    status: "error",
    code,
    message,
    timestamp: new Date().toISOString(),
  });

export function autenticar(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    json401(res, "NO_TOKEN", "Token de autenticación requerido.");
    return;
  }

  const token = header.split(" ")[1];

  if (tokenEstaInvalidado(token)) {
    json401(res, "TOKEN_REVOKED", "Sesión cerrada. Inicia sesión nuevamente.");
    return;
  }

  try {
    req.usuario = verificarAccessToken(token);
    next();
  } catch {
    json401(res, "INVALID_TOKEN", "Token inválido o expirado.");
  }
}

export function autorizar(...roles: UsuarioRol[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({
        status: "error",
        code: "NO_AUTH",
        message: "No autenticado.",
        timestamp: new Date().toISOString(),
      });
      return;
    }
    if (!roles.includes(req.usuario.rol)) {
      res.status(403).json({
        status: "error",
        code: "FORBIDDEN",
        message: `Acceso denegado. Roles permitidos: ${roles.join(", ")}.`,
        timestamp: new Date().toISOString(),
      });
      return;
    }
    next();
  };
}
