// src/controllers/materiaController.ts

import { Request, Response } from "express";
import { MateriaService } from "../services/materiaService";

const materiaService = new MateriaService();

/* ======================================================
   MATERIAS
====================================================== */

export async function getMaterias(_req: Request, res: Response): Promise<void> {
  const materias = await materiaService.obtenerTodas();

  res.json({
    status: "success",
    data: materias,
    timestamp: new Date().toISOString(),
  });
}

export async function getMateria(req: Request, res: Response): Promise<void> {
  const materia = await materiaService.obtenerPorId(req.params.id);

  res.json({
    status: "success",
    data: materia,
    timestamp: new Date().toISOString(),
  });
}

export async function crearMateria(req: Request, res: Response): Promise<void> {
  const materia = await materiaService.crear(req.body);

  res.status(201).json({
    status: "success",
    data: materia,
    timestamp: new Date().toISOString(),
  });
}

export async function actualizarMateria(
  req: Request,
  res: Response,
): Promise<void> {
  const materia = await materiaService.actualizar(req.params.id, req.body);

  res.json({
    status: "success",
    data: materia,
    timestamp: new Date().toISOString(),
  });
}

export async function eliminarMateria(
  req: Request,
  res: Response,
): Promise<void> {
  await materiaService.eliminar(req.params.id);

  res.json({
    status: "success",
    data: {
      mensaje: "Materia eliminada correctamente",
    },
    timestamp: new Date().toISOString(),
  });
}
