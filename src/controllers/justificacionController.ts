// src/controllers/justificacionController.ts
import { Request, Response } from "express";

import { JustificacionService } from "../services/justificacionService";

const service = new JustificacionService();

export async function obtenerJustificaciones(
  _req: Request,
  res: Response,
): Promise<void> {
  const data = await service.obtenerTodas();

  res.json({
    status: "success",
    data,
    timestamp: new Date().toISOString(),
  });
}

// ---------------------- crear
/**
 * @swagger
 *
 * /justificaciones:
 *
 *   post:
 *
 *     summary:
 *       Crear justificación
 *
 *     tags:
 *       - Justificaciones
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
 *               marcadoId:
 *                 type: string
 *
 *               docenteId:
 *                 type: string
 *
 *               motivo:
 *                 type: string
 *                 example: Certificado médico
 *
 *               archivo:
 *                 type: string
 *                 example: certificado.pdf
 *
 *     responses:
 *
 *       201:
 *
 *         description:
 *           Justificación creada
 */
export async function crearJustificacion(
  req: Request,
  res: Response,
): Promise<void> {
  const data = await service.solicitar(req.body);

  res.status(201).json({
    status: "success",
    data,
    timestamp: new Date().toISOString(),
  });
}

//--------------- aprobar
/**
 * @swagger
 *
 * /justificaciones/{id}/aprobar:
 *
 *   patch:
 *
 *     summary:
 *       Aprobar justificación
 *
 *     tags:
 *       - Justificaciones
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
 *           Justificación aprobada
 */
export async function aprobarJustificacion(
  req: Request,
  res: Response,
): Promise<void> {
  const data = await service.aprobar(req.params.id, req.body.observaciones);

  res.json({
    status: "success",
    data,
    timestamp: new Date().toISOString(),
  });
}

//----------------  rechazar
/**
 * @swagger
 *
 * /justificaciones/{id}/rechazar:
 *
 *   patch:
 *
 *     summary:
 *       Rechazar justificación
 *
 *     tags:
 *       - Justificaciones
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
 *           Justificación rechazada
 */
export async function rechazarJustificacion(
  req: Request,
  res: Response,
): Promise<void> {
  const data = await service.rechazar(req.params.id, req.body.observaciones);

  res.json({
    status: "success",
    data,
    timestamp: new Date().toISOString(),
  });
}
