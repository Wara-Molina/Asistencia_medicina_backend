// src/controllers/sessionController.ts
import { Request, Response } from "express";

import { SessionService } from "../services/sessionService";

const sessionService = new SessionService();

export async function obtenerSesiones(
  req: Request,
  res: Response,
): Promise<void> {
  const sesiones = await sessionService.obtenerSesiones(req.usuario!.sub);

  const limpio = sesiones.map((s) => ({
    id: s.id,

    ip: s.ip,

    userAgent: s.userAgent,

    activa: s.activa,

    fechaCreacion: s.fechaCreacion,
  }));

  res.json({
    status: "success",

    data: limpio,

    timestamp: new Date().toISOString(),
  });
}

export async function cerrarSesion(req: Request, res: Response): Promise<void> {
  await sessionService.cerrarSesion(req.params.id);

  res.json({
    status: "success",

    data: {
      mensaje: "Sesión cerrada",
    },

    timestamp: new Date().toISOString(),
  });
}
