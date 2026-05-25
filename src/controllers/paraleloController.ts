// src/controllers/paraleloController.ts

import { Request, Response } from "express";
import { ParaleloService } from "../services/paraleloService";

const paraleloService = new ParaleloService();

export async function getParalelos(req: Request, res: Response): Promise<void> {
  const semestre = req.query.semestre as string | undefined;

  const paralelos = await paraleloService.obtenerTodos(semestre);

  res.json({
    status: "success",
    data: paralelos,
    timestamp: new Date().toISOString(),
  });
}

export async function getParalelo(req: Request, res: Response): Promise<void> {
  const paralelo = await paraleloService.obtenerPorId(req.params.id);

  res.json({
    status: "success",
    data: paralelo,
    timestamp: new Date().toISOString(),
  });
}

export async function crearParalelo(
  req: Request,
  res: Response,
): Promise<void> {
  const paralelo = await paraleloService.crear(req.body);

  res.status(201).json({
    status: "success",
    data: paralelo,
    timestamp: new Date().toISOString(),
  });
}

export async function actualizarParalelo(
  req: Request,
  res: Response,
): Promise<void> {
  const paralelo = await paraleloService.actualizar(req.params.id, req.body);

  res.json({
    status: "success",
    data: paralelo,
    timestamp: new Date().toISOString(),
  });
}

export async function eliminarParalelo(
  req: Request,
  res: Response,
): Promise<void> {
  await paraleloService.eliminar(req.params.id);

  res.json({
    status: "success",
    data: {
      mensaje: "Paralelo eliminado correctamente",
    },
    timestamp: new Date().toISOString(),
  });
}
