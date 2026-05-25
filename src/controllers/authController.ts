// src/controllers/authController.ts

import { Request, Response } from "express";

import { AppDataSource } from "../config/database";

import { Usuario } from "../models/Usuario";

import {
  generarTokens,
  verificarPassword,
  verificarRefreshToken,
  invalidarToken,
} from "../services/authService";

import { AuditService } from "../services/auditService";

import { AppError } from "../middlewares/errorHandler";

import { loginSchema, refreshSchema } from "../validations/schemas";

import { logger } from "../config/logger";
import { SessionService } from "../services/sessionService";

const auditService = new AuditService();
const sessionService = new SessionService();

/* =====================================================
   LOGIN
===================================================== */

/**
 * @swagger
 *
 * /auth/login:
 *
 *   post:
 *
 *     summary:
 *       Iniciar sesión
 *
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *
 *       required:
 *         true
 *
 *       content:
 *
 *         application/json:
 *
 *           schema:
 *
 *             type: object
 *
 *             properties:
 *
 *               email:
 *
 *                 type: string
 *
 *                 example:
 *                   admin@medicina.edu.bo
 *
 *               password:
 *
 *                 type: string
 *
 *                 example:
 *                   Medicina2026!
 *
 *     responses:
 *
 *       200:
 *
 *         description:
 *           Login correcto
 *
 *       401:
 *
 *         description:
 *           Credenciales inválidas
 */
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = loginSchema.parse(req.body);
  const repo = () => AppDataSource.getRepository(Usuario);
  const usuario = await repo().findOneBy({
    email,

    activo: true,
  });

  if (!usuario) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Email o contraseña incorrectos.",
    );
  }

  if (usuario.bloqueado) {
    throw new AppError(
      403,
      "USUARIO_BLOQUEADO",
      "Usuario bloqueado por múltiples intentos.",
    );
  }

  const passwordValida = await verificarPassword(password, usuario.password);

  if (!passwordValida) {
    usuario.intentosFallidos += 1;

    if (usuario.intentosFallidos >= 3) {
      usuario.bloqueado = true;
    }

    await repo().save(usuario);

    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      `Intento ${usuario.intentosFallidos}/3`,
    );
  }

  usuario.intentosFallidos = 0;

  await repo().save(usuario);

  await repo().update(
    usuario.id,

    {
      ultimoAcceso: new Date(),
    },
  );

  const tokens = generarTokens(usuario);

  await sessionService.registrarLogin(
    usuario.id,

    tokens.accessToken,

    req.ip,

    req.headers["user-agent"] as string,
  );

  logger.info(`Login: ${email} [${usuario.rol}]`);

  // ─── AUDITORÍA ───────────────────────

  await auditService.registrar(
    "LOGIN",

    "USUARIO",

    usuario.id,

    usuario.id,

    {
      email: usuario.email,

      rol: usuario.rol,

      fecha: new Date().toISOString(),
    },
  );

  // ─── RESPUESTA ───────────────────────

  res.json({
    status: "success",

    data: {
      ...tokens,

      usuario: {
        id: usuario.id,

        email: usuario.email,

        nombreCompleto: usuario.nombreCompleto,

        rol: usuario.rol,

        docenteId: usuario.docenteId,
      },
    },

    timestamp: new Date().toISOString(),
  });
}

/* =====================================================
   REFRESH TOKEN
===================================================== */

export async function refreshToken(req: Request, res: Response): Promise<void> {
  const { refreshToken } = refreshSchema.parse(req.body);
  const repo = () => AppDataSource.getRepository(Usuario);

  let payload: {
    sub: string;
  };

  try {
    payload = verificarRefreshToken(refreshToken);
  } catch {
    throw new AppError(
      401,

      "INVALID_REFRESH_TOKEN",

      "Refresh token inválido o expirado.",
    );
  }

  const usuario = await repo().findOneBy({
    id: payload.sub,

    activo: true,
  });

  if (!usuario) {
    throw new AppError(
      401,

      "USER_NOT_FOUND",

      "Usuario no encontrado.",
    );
  }

  res.json({
    status: "success",

    data: generarTokens(usuario),

    timestamp: new Date().toISOString(),
  });
}

/* =====================================================
   LOGOUT
===================================================== */
/**
 * @swagger
 *
 * /auth/logout:
 *
 *   post:
 *
 *     summary:
 *       Cerrar sesión
 *
 *     tags:
 *       - Auth
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *
 *         description:
 *           Logout exitoso
 *
 *       401:
 *
 *         description:
 *           No autorizado
 */
export async function logout(req: Request, res: Response): Promise<void> {
  const token = req.headers.authorization!.split(" ")[1];

  invalidarToken(token);

  await sessionService.cerrarTodas(req.usuario!.sub);

  await auditService.registrar(
    "LOGOUT",

    "USUARIO",

    undefined,

    undefined,

    {
      fecha: new Date().toISOString(),
    },
  );

  res.json({
    status: "success",

    data: {
      mensaje: "Sesión cerrada correctamente.",
    },

    timestamp: new Date().toISOString(),
  });
}
