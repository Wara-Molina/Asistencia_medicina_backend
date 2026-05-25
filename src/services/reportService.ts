// src/services/reportService.ts

import { AppDataSource } from "../config/database";

import { Marcado, AsistenciaEstado, MarcadoEstado } from "../models/Marcado";

import { Justificacion, JustificacionEstado } from "../models/Justificacion";

export class ReportService {
  private marcadoRepo = AppDataSource.getRepository(Marcado);

  private justificacionRepo = AppDataSource.getRepository(Justificacion);

  async resumenGeneral() {
    const presentes = await this.marcadoRepo.countBy({
      estadoAsistencia: AsistenciaEstado.PRESENTE,
    });

    const ausentes = await this.marcadoRepo.countBy({
      estadoAsistencia: AsistenciaEstado.AUSENTE,
    });

    const tardanzas = await this.marcadoRepo.countBy({
      estadoAsistencia: AsistenciaEstado.TARDANZA,
    });

    const abandono = await this.marcadoRepo.countBy({
      estado: MarcadoEstado.POSIBLE_ABANDONO,
    });

    const justificadas = await this.justificacionRepo.countBy({
      estado: JustificacionEstado.APROBADA,
    });

    return {
      presentes,
      ausentes,
      tardanzas,
      abandono,
      justificadas,
    };
  }

  async reporteDocente(docenteId: string) {
    const marcados = await this.marcadoRepo.findBy({
      docenteId,
    });

    const presentes = marcados.filter(
      (x) => x.estadoAsistencia === AsistenciaEstado.PRESENTE,
    ).length;

    const ausentes = marcados.filter(
      (x) => x.estadoAsistencia === AsistenciaEstado.AUSENTE,
    ).length;

    const tardanzas = marcados.filter(
      (x) => x.estadoAsistencia === AsistenciaEstado.TARDANZA,
    ).length;

    const abandono = marcados.filter(
      (x) => x.estado === MarcadoEstado.POSIBLE_ABANDONO,
    ).length;

    const horasTrabajadas = marcados.reduce(
      (total, item) => total + (item.minutosTrabajados || 0),

      0,
    );

    const total = marcados.length;

    const porcentaje =
      total === 0 ? 0 : Number(((presentes / total) * 100).toFixed(2));

    return {
      docenteId,

      presentes,

      ausentes,

      tardanzas,

      abandono,

      horasTrabajadas,

      porcentajeAsistencia: porcentaje,
    };
  }

  async rankingDocentes() {
    const marcados = await this.marcadoRepo.find({
      relations: {
        docente: true,
      },
    });

    const mapa = new Map<
      string,
      {
        nombre: string;
        total: number;
        presentes: number;
      }
    >();

    for (const item of marcados) {
      if (!item.docente) {
        continue;
      }

      const id = item.docente.id;

      if (!mapa.has(id)) {
        mapa.set(
          id,

          {
            nombre: item.docente.nombreCompleto,

            total: 0,

            presentes: 0,
          },
        );
      }

      const actual = mapa.get(id)!;

      actual.total++;

      if (item.estadoAsistencia === AsistenciaEstado.PRESENTE) {
        actual.presentes++;
      }
    }

    return Array.from(mapa.values())

      .map((x) => ({
        docente: x.nombre,

        porcentaje:
          x.total === 0
            ? 0
            : Number(((x.presentes / x.total) * 100).toFixed(2)),
      }))

      .sort((a, b) => b.porcentaje - a.porcentaje);
  }

  async topAusencias() {
    const marcados = await this.marcadoRepo.find({
      relations: {
        docente: true,
      },
    });

    const mapa = new Map<
      string,
      {
        docente: string;
        cantidad: number;
      }
    >();

    for (const item of marcados) {
      if (item.estadoAsistencia !== AsistenciaEstado.AUSENTE) {
        continue;
      }

      if (!item.docente) {
        continue;
      }

      const id = item.docente.id;

      if (!mapa.has(id)) {
        mapa.set(
          id,

          {
            docente: item.docente.nombreCompleto,

            cantidad: 0,
          },
        );
      }

      mapa.get(id)!.cantidad++;
    }

    return Array.from(mapa.values())

      .sort((a, b) => b.cantidad - a.cantidad);
  }

  async topTardanzas() {
    const marcados = await this.marcadoRepo.find({
      relations: {
        docente: true,
      },
    });

    const mapa = new Map<
      string,
      {
        docente: string;
        cantidad: number;
      }
    >();

    for (const item of marcados) {
      if (item.estadoAsistencia !== AsistenciaEstado.TARDANZA) {
        continue;
      }

      if (!item.docente) {
        continue;
      }

      const id = item.docente.id;

      if (!mapa.has(id)) {
        mapa.set(
          id,

          {
            docente: item.docente.nombreCompleto,

            cantidad: 0,
          },
        );
      }

      mapa.get(id)!.cantidad++;
    }

    return Array.from(mapa.values())

      .sort((a, b) => b.cantidad - a.cantidad);
  }

  async dashboardDirector() {
    const resumen = await this.resumenGeneral();

    const topAusencias = await this.topAusencias();

    const topTardanzas = await this.topTardanzas();

    const ranking = await this.rankingDocentes();

    const riesgo = ranking.filter((x) => x.porcentaje < 70);

    return {
      presentes: resumen.presentes,

      ausentes: resumen.ausentes,

      tardanzas: resumen.tardanzas,

      abandono: resumen.abandono,

      justificadas: resumen.justificadas,

      topAusencias,

      topTardanzas,

      riesgo,
    };
  }
}
