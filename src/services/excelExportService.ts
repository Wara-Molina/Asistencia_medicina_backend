// src/services/excelExportService.ts

import ExcelJS from "exceljs";

import { AppDataSource } from "../config/database";

import { Marcado, AsistenciaEstado } from "../models/Marcado";

export class ExcelExportService {
  private repo = AppDataSource.getRepository(Marcado);

  async generarExcel(): Promise<Buffer> {
    const marcados = await this.repo.find({
      relations: {
        docente: true,
        horario: true,
        ubicacion: true,
      },
    });

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Sistema Medicina";

    workbook.created = new Date();

    // =========================
    // HOJA DETALLE
    // =========================

    const detalle = workbook.addWorksheet("Asistencia");

    detalle.columns = [
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
        header: "Ubicación",
        key: "ubicacion",
        width: 30,
      },

      {
        header: "Tipo",
        key: "tipo",
        width: 20,
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
        header: "Min Retraso",
        key: "retraso",
        width: 15,
      },

      {
        header: "Min Trabajados",
        key: "trabajados",
        width: 20,
      },
    ];

    for (const item of marcados) {
      detalle.addRow({
        docente: item.docente?.nombreCompleto ?? "-",

        fecha: item.fecha,

        ubicacion: item.ubicacion?.nombre ?? "-",

        tipo: item.tipoMarcado,

        estado: item.estado,

        asistencia: item.estadoAsistencia,

        retraso: item.minutosRetraso,

        trabajados: item.minutosTrabajados,
      });
    }

    detalle.getRow(1).font = {
      bold: true,
    };

    // =========================
    // HOJA ESTADISTICAS
    // =========================

    const estadisticas = workbook.addWorksheet("Resumen");

    const presentes = marcados.filter(
      (x) => x.estadoAsistencia === AsistenciaEstado.PRESENTE,
    ).length;

    const tardanzas = marcados.filter(
      (x) => x.estadoAsistencia === AsistenciaEstado.TARDANZA,
    ).length;

    const ausentes = marcados.filter(
      (x) => x.estadoAsistencia === AsistenciaEstado.AUSENTE,
    ).length;

    const abandono = marcados.filter(
      (x) => x.estadoAsistencia === AsistenciaEstado.ABANDONO,
    ).length;

    const salida = marcados.filter(
      (x) => x.estadoAsistencia === AsistenciaEstado.SALIDA_ANTICIPADA,
    ).length;

    estadisticas.addRow(["Indicador", "Cantidad"]);

    estadisticas.addRow(["Presentes", presentes]);

    estadisticas.addRow(["Tardanzas", tardanzas]);

    estadisticas.addRow(["Ausentes", ausentes]);

    estadisticas.addRow(["Abandono", abandono]);

    estadisticas.addRow(["Salida anticipada", salida]);

    estadisticas.getRow(1).font = {
      bold: true,
    };

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);
  }
}
