// src/controllers/reportController.ts

import { Request, Response } from "express";

import { ReportService } from "../services/reportService";

const service = new ReportService();

// ------ Obtener resumen
/**
 * @swagger
 *
 * /reportes/resumen:
 *
 *   get:
 *
 *     summary:
 *       Resumen general asistencia
 *
 *     tags:
 *       - Reportes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *
 *         description:
 *           Estadísticas generales
 */
export async function obtenerResumen(
  _req: Request,
  res: Response,
): Promise<void> {
  const data = await service.resumenGeneral();

  res.json({
    status: "success",

    data,

    timestamp: new Date().toISOString(),
  });
}

export async function obtenerReporteDocente(
  req: Request,
  res: Response,
): Promise<void> {
  const data = await service.reporteDocente(req.params.id);

  res.json({
    status: "success",

    data,

    timestamp: new Date().toISOString(),
  });
}

// ------------------- Ranking
/**
 * @swagger
 *
 * /reportes/ranking:
 *
 *   get:
 *
 *     summary:
 *       Ranking docentes
 *
 *     tags:
 *       - Reportes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *
 *         description:
 *           Ranking asistencia
 */
export async function obtenerRanking(
  _req: Request,
  res: Response,
): Promise<void> {
  const data = await service.rankingDocentes();

  res.json({
    status: "success",

    data,

    timestamp: new Date().toISOString(),
  });
}

//------------------------- Dashboard
/**
 * @swagger
 *
 * /reportes/dashboard-director:
 *
 *   get:
 *
 *     summary:
 *       Dashboard ejecutivo director
 *
 *     tags:
 *       - Reportes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *
 *         description:
 *           Dashboard institucional
 */
export async function obtenerDashboardDirector(
  _req: Request,
  res: Response,
): Promise<void> {
  const data = await service.dashboardDirector();

  res.json({
    status: "success",

    data,

    timestamp: new Date().toISOString(),
  });
}
