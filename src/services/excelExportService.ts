// src/services/excelExportService.ts

import ExcelJS from "exceljs";

import { AppDataSource } from "../config/database";

import { Marcado } from "../models/Marcado";

export class ExcelExportService {
  private repo = AppDataSource.getRepository(Marcado);

  async generarExcel(): Promise<Buffer> {
    const marcados = await this.repo.find({
      relations: {
        docente: true,
      },
    });

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Asistencia");

    sheet.columns = [
      {
        header: "Docente",
        key: "docente",
        width: 30,
      },

      {
        header: "Fecha",
        key: "fecha",
        width: 15,
      },

      {
        header: "Estado",
        key: "estado",
        width: 20,
      },

      {
        header: "Asistencia",
        key: "asistencia",
        width: 20,
      },

      {
        header: "Minutos",
        key: "minutos",
        width: 15,
      },
    ];

    for (const item of marcados) {
      sheet.addRow({
        docente: item.docente?.nombreCompleto ?? "-",

        fecha: item.fecha,

        estado: item.estado,

        asistencia: item.estadoAsistencia,

        minutos: item.minutosTrabajados,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);
  }
}
