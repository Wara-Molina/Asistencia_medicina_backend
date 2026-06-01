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
    const marcados = await this.marcadoRepo.find({
      relations: {
        docente: true,
        ubicacion: true,
      },
    });

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

    const doc = new PDFDocument({
      margin: 50,
    });

    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.fontSize(18);

    doc.text("FACULTAD DE MEDICINA", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(15);

    doc.text("REPORTE GENERAL DE ASISTENCIA");

    doc.moveDown();

    doc.fontSize(12);

    doc.text(`Presentes: ${presentes}`);

    doc.text(`Ausentes: ${ausentes}`);

    doc.text(`Abandonos: ${abandono}`);

    doc.text(`Justificadas: ${justificadas}`);

    doc.moveDown();

    doc.text(`Generado: ${new Date().toISOString()}`);

    doc.moveDown();

    doc.fontSize(14);

    doc.text("DETALLE DOCENTES");

    doc.moveDown();

    for (const item of marcados) {
      doc.fontSize(10);

      doc.text(
        `${item.docente?.nombreCompleto ?? "-"} | ${item.fecha} | ${item.estadoAsistencia ?? "-"} | ${item.ubicacion?.nombre ?? "-"}`,
      );
    }

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
