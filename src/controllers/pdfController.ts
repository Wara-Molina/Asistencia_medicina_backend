// src/controllers/pdfController.ts
import { Request, Response } from "express";

import { PdfExportService } from "../services/pdfExportService";

const service = new PdfExportService();

//----------------------
/**
 * @swagger
 *
 * /reportes/pdf:
 *
 *   get:
 *
 *     summary:
 *       Exportar reporte PDF
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
 *           Archivo PDF generado
 */
export async function exportarPdf(_req: Request, res: Response): Promise<void> {
  const file = await service.generarPdf();

  res.setHeader(
    "Content-Type",

    "application/pdf",
  );

  res.setHeader(
    "Content-Disposition",

    'attachment; filename="resumen.pdf"',
  );

  res.send(file);

  console.log("PDF generado", file.length);
}
