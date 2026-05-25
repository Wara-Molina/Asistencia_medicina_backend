// src/controllers/docenteController.ts

import { Request, Response } from "express";
import { DocenteService } from "../services/docenteService";

const docenteService = new DocenteService();

// ---------- obtener o listar
/**
 * @swagger
 *
 * /docentes:
 *
 *   get:
 *
 *     summary:
 *       Obtener docentes
 *
 *     tags:
 *       - Docentes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *
 *         description:
 *           Lista de docentes
 */
export async function getDocentes(_req: Request, res: Response): Promise<void> {
  const docentes = await docenteService.obtenerTodos();

  res.json({
    status: "success",
    data: docentes,
    timestamp: new Date().toISOString(),
  });
}

export async function getDocente(req: Request, res: Response): Promise<void> {
  const docente = await docenteService.obtenerPorId(req.params.id);

  res.json({
    status: "success",
    data: docente,
    timestamp: new Date().toISOString(),
  });
}

// ---------- crear
/**
 * @swagger
 *
 * /docentes:
 *
 *   post:
 *
 *     summary:
 *       Crear docente
 *
 *     tags:
 *       - Docentes
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
 *               nombreCompleto:
 *                 type: string
 *                 example: Dr. Carlos Mendoza
 *
 *               email:
 *                 type: string
 *                 example: c.mendoza@medicina.edu.bo
 *
 *               cedula:
 *                 type: string
 *                 example: 1234567
 *
 *               departamento:
 *                 type: string
 *                 example: Anatomía
 *
 *     responses:
 *
 *       201:
 *         description:
 *           Docente creado
 */
export async function crearDocente(req: Request, res: Response): Promise<void> {
  const resultado = await docenteService.crear(req.body);

  res.status(201).json({
    status: "success",
    data: resultado,
    timestamp: new Date().toISOString(),
  });
}

export async function actualizarDocente(
  req: Request,
  res: Response,
): Promise<void> {
  const docente = await docenteService.actualizar(req.params.id, req.body);

  res.json({
    status: "success",
    data: docente,
    timestamp: new Date().toISOString(),
  });
}
