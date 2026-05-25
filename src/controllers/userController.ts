// src/controllers/userController.ts

import { Request, Response } from "express";

import { UserService } from "../services/userService";

import { changePasswordSchema } from "../validations/schemas";
import {
  resetRequestSchema,
  resetPasswordSchema,
} from "../validations/schemas";

const userService = new UserService();

export async function cambiarPassword(
  req: Request,
  res: Response,
): Promise<void> {
  const body = changePasswordSchema.parse(req.body);

  console.log("JWT:", req.usuario);

  const usuarioId = req.usuario?.sub;

  if (!usuarioId) {
    throw new Error("Usuario no autenticado");
  }

  await userService.cambiarPassword(
    usuarioId,

    body.nuevaPassword,
  );

  res.json({
    status: "success",

    data: {
      mensaje: "Contraseña actualizada",
    },

    timestamp: new Date().toISOString(),
  });
}

export async function solicitarResetPassword(
  req: Request,
  res: Response,
): Promise<void> {
  const body = resetRequestSchema.parse(req.body);

  const token = await userService.solicitarReset(body.email);

  res.json({
    status: "success",

    data: {
      mensaje: "Token generado",

      token,
    },

    timestamp: new Date().toISOString(),
  });
}

export async function resetPassword(
  req: Request,
  res: Response,
): Promise<void> {
  const body = resetPasswordSchema.parse(req.body);

  await userService.resetPassword(
    body.token,

    body.nuevaPassword,
  );

  res.json({
    status: "success",

    data: {
      mensaje: "Contraseña restaurada",
    },

    timestamp: new Date().toISOString(),
  });
}
