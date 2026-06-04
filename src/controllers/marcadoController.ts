// src/controllers/marcadoController.ts

import { Request, Response, NextFunction } from "express";
import { MarcadoService } from "../services/marcadoService";

const marcadoService = new MarcadoService();

// ---------- obtener o listar
/**
 * @swagger
 *
 * /marcados:
 *
 *   get:
 *
 *     summary:
 *       Listar asistencias
 *
 *     tags:
 *       - Marcados
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *
 *         description:
 *           Lista de marcados
 */
export async function getMarcados(_req: Request, res: Response): Promise<void> {
  const marcados = await marcadoService.obtenerTodos();

  res.json({
    status: "success",
    data: marcados,
    timestamp: new Date().toISOString(),
  });
}

export async function getMarcado(req: Request, res: Response): Promise<void> {
  const marcado = await marcadoService.obtenerPorId(req.params.id);

  res.json({
    status: "success",
    data: marcado,
    timestamp: new Date().toISOString(),
  });
}

export async function getMarcadosDocente(
  req: Request,
  res: Response,
): Promise<void> {
  const marcados = await marcadoService.obtenerPorDocente(req.params.docenteId);

  res.json({
    status: "success",
    data: marcados,
    timestamp: new Date().toISOString(),
  });
}

//------------------- Registrar
/**
 * @swagger
 *
 * /marcados:
 *
 *   post:
 *
 *     summary:
 *       Registrar asistencia
 *
 *     tags:
 *       - Marcados
 *
 *     security:
 *       - bearerAuth: []
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
 *               docenteId:
 *                 type: string
 *
 *               horarioId:
 *                 type: string
 *
 *               tipoMarcado:
 *                 type: string
 *                 example: app_hospital
 *
 *               ubicacionId:
 *                 type: string
 *
 *               latitud:
 *                 type: number
 *                 example: -16.479603
 *
 *               longitud:
 *                 type: number
 *                 example: -68.193263
 *
 *               notas:
 *                 type: string
 *                 example: Inicio práctica hospitalaria
 *
 *     responses:
 *
 *       201:
 *
 *         description:
 *           Marcado registrado
 */
export async function registrarMarcado(
  req: Request,
  res: Response,
): Promise<void> {
  const marcado = await marcadoService.crear(req.body);

  res.status(201).json({
    status: "success",
    data: marcado,
    timestamp: new Date().toISOString(),
  });
}

//----------------- Marcar salida
/**
 * @swagger
 *
 * /marcados/{id}/salida:
 *
 *   patch:
 *
 *     summary:
 *       Registrar salida docente
 *
 *     tags:
 *       - Marcados
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *
 *         name: id
 *
 *         required: true
 *
 *         schema:
 *
 *           type: string
 *
 *     responses:
 *
 *       200:
 *
 *         description:
 *           Salida registrada
 */
export async function marcarSalida(req: Request, res: Response): Promise<void> {
  const marcado = await marcadoService.finalizar(req.params.id);

  res.json({
    status: "success",
    data: marcado,
    timestamp: new Date().toISOString(),
  });
}

export async function eliminarMarcado(
  req: Request,
  res: Response,
): Promise<void> {
  await marcadoService.eliminar(req.params.id);

  res.json({
    status: "success",

    data: {
      mensaje: "Marcado eliminado correctamente",
    },

    timestamp: new Date().toISOString(),
  });
}

export async function confirmarAbandono(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await marcadoService.confirmarAbandono(
      req.params.id,
    );

    res.json({
      status: "success",
      message:
        "Abandono confirmado",
    });
  } catch (error) {
    next(error);
  }
}

export async function rechazarAbandono(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await marcadoService.rechazarAbandono(
      req.params.id,
    );

    res.json({
      status: "success",
      message:
        "Abandono rechazado",
    });
  } catch (error) {
    next(error);
  }
}
 export async function obtenerAbandonosPendientes(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data =
      await marcadoService.obtenerAbandonosPendientes();

    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function obtenerMarcadoActivo(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const marcado =
      await marcadoService.obtenerMarcadoActivo(
        req.params.docenteId,
      );

    res.json({
      status: "success",
      data: marcado,
    });
  } catch (error) {
    next(error);
  }
}