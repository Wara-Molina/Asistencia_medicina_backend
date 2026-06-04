// src/services/reportService.ts

import { AppDataSource } from "../config/database";

import { Marcado, AsistenciaEstado, MarcadoEstado } from "../models/Marcado";

import { Justificacion, JustificacionEstado } from "../models/Justificacion";

export class ReportService {
  private marcadoRepo = AppDataSource.getRepository(Marcado);

  private justificacionRepo = AppDataSource.getRepository(Justificacion);

  // =====================================
  // RESUMEN GENERAL
  // =====================================

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

const abandono = await this.marcadoRepo.count({
  where: [
    {
      estado:
        MarcadoEstado.POSIBLE_ABANDONO,
    },
    {
      estado:
        MarcadoEstado.ABANDONO_CONFIRMADO,
    },
  ],
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

  // =====================================
  // REPORTE DOCENTE
  // =====================================

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
  (x) =>
    x.estado ===
      MarcadoEstado.POSIBLE_ABANDONO ||
    x.estado ===
      MarcadoEstado.ABANDONO_CONFIRMADO,
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

      totalMarcados: total,

      porcentajeAsistencia: porcentaje,
    };
  }

  // =====================================
  // RANKING DOCENTES
  // =====================================

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

if (
  item.estadoAsistencia ===
    AsistenciaEstado.PRESENTE ||
  item.estadoAsistencia ===
    AsistenciaEstado.TARDANZA
) {
  actual.presentes++;
}
    }

    const ranking = Array.from(mapa.entries()).map(([id, value]) => ({
      docenteId: id,

      nombre: value.nombre,

      total: value.total,

      presentes: value.presentes,

      porcentaje:
        value.total === 0
          ? 0
          : Number(((value.presentes / value.total) * 100).toFixed(2)),
    }));

    ranking.sort((a, b) => b.porcentaje - a.porcentaje);

    return ranking;
  }

  // =====================================
  // DASHBOARD DIRECTOR
  // =====================================

  async dashboardDirector() {
    const resumen = await this.resumenGeneral();

    const ranking = await this.rankingDocentes();

    const pendientes = await this.justificacionRepo.countBy({
      estado: JustificacionEstado.PENDIENTE,
    });

    const aprobadas = await this.justificacionRepo.countBy({
      estado: JustificacionEstado.APROBADA,
    });

    const rechazadas = await this.justificacionRepo.countBy({
      estado: JustificacionEstado.RECHAZADA,
    });

    return {
      resumen,

      justificaciones: {
        pendientes,

        aprobadas,

        rechazadas,
      },

      top5: ranking.slice(0, 5),

      generado: new Date().toISOString(),
    };
  }
}
