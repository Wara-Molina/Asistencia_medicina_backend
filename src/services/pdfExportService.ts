// src/services/pdfExportService.ts

import PDFDocument from "pdfkit";

import { AppDataSource } from "../config/database";

import { Marcado } from "../models/Marcado";

import { Justificacion } from "../models/Justificacion";

import { AsistenciaEstado, MarcadoEstado } from "../models/Marcado";

import { JustificacionEstado } from "../models/Justificacion";

export class PdfExportService {
  private marcadoRepo = AppDataSource.getRepository(Marcado);

  private justificacionRepo = AppDataSource.getRepository(Justificacion);

  async generarPdf(): Promise<Buffer> {
    const presentes = await this.marcadoRepo.countBy({
      estadoAsistencia: AsistenciaEstado.PRESENTE,
    });

    const ausentes = await this.marcadoRepo.countBy({
      estadoAsistencia: AsistenciaEstado.AUSENTE,
    });

    const abandono = await this.marcadoRepo.countBy({
      estado: MarcadoEstado.POSIBLE_ABANDONO,
    });

    const justificadas = await this.justificacionRepo.countBy({
      estado: JustificacionEstado.APROBADA,
    });

    const doc = new PDFDocument();

    const buffers: Buffer[] = [];

    doc.on(
      "data",

      buffers.push.bind(buffers),
    );

    doc.on(
      "end",

      () => {},
    );

    doc.fontSize(20);

    doc.text("REPORTE GENERAL DE ASISTENCIA");

    doc.moveDown();

    doc.fontSize(14);

    doc.text(`Presentes: ${presentes}`);

    doc.text(`Ausentes: ${ausentes}`);

    doc.text(`Abandonos: ${abandono}`);

    doc.text(`Justificadas: ${justificadas}`);

    doc.moveDown();

    doc.text(`Generado: ${new Date().toISOString()}`);

    doc.end();

    return await new Promise((resolve) => {
      doc.on(
        "end",

        () => {
          resolve(Buffer.concat(buffers));
        },
      );
    });
  }
}
