// src/controllers/horarioController.ts

import { Request, Response } from "express";
import { HorarioService } from "../services/horarioService";

const horarioService = new HorarioService();

export async function getHorarios(_req: Request, res: Response): Promise<void> {
  const horarios = await horarioService.obtenerTodos();

  res.json({
    status: "success",
    data: horarios,
    timestamp: new Date().toISOString(),
  });
}

export async function getHorario(req: Request, res: Response): Promise<void> {
  const horario = await horarioService.obtenerPorId(req.params.id);

  res.json({
    status: "success",
    data: horario,
    timestamp: new Date().toISOString(),
  });
}

export async function getHorariosParalelo(
  req: Request,
  res: Response,
): Promise<void> {
  const horarios = await horarioService.obtenerPorParalelo(req.params.id);

  res.json({
    status: "success",
    data: horarios,
    timestamp: new Date().toISOString(),
  });
}

export async function crearHorario(req: Request, res: Response): Promise<void> {
  const horario = await horarioService.crear(req.body);

  res.status(201).json({
    status: "success",
    data: horario,
    timestamp: new Date().toISOString(),
  });
}

export async function actualizarHorario(
  req: Request,
  res: Response,
): Promise<void> {
  const horario = await horarioService.actualizar(req.params.id, req.body);

  res.json({
    status: "success",
    data: horario,
    timestamp: new Date().toISOString(),
  });
}

export async function eliminarHorario(
  req: Request,
  res: Response,
): Promise<void> {
  await horarioService.eliminar(req.params.id);

  res.json({
    status: "success",

    data: {
      mensaje: "Horario eliminado correctamente",
    },

    timestamp: new Date().toISOString(),
  });
}
export async function getHorariosDocente(
  req: Request,
  res: Response,
): Promise<void> {
  const horarios = await horarioService.obtenerPorDocente(req.params.docenteId);

  res.json({
    status: "success",
    data: horarios,
    timestamp: new Date().toISOString(),
  });
}
