// src/controllers/exportController.ts
import { Request, Response } from "express";

import { ExcelExportService } from "../services/excelExportService";

const service = new ExcelExportService();

//-------------
/**
 * @swagger
 *
 * /reportes/excel:
 *
 *   get:
 *
 *     summary:
 *       Exportar reporte Excel
 *
 *     tags:
 *       - Exportaciones
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *
 *         description:
 *           Archivo Excel generado
 */
export async function exportarExcel(
  _req: Request,
  res: Response,
): Promise<void> {
  const file = await service.generarExcel();

  res.setHeader(
    "Content-Type",

    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );

  res.setHeader(
    "Content-Disposition",

    'attachment; filename="asistencia.xlsx"',
  );

  res.send(file);

  console.log("Excel generado", file.length);
}
