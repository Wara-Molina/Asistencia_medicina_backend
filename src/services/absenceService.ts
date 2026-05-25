// src/services/absenceService.ts

import { AppDataSource } from "../config/database";

import {
  Marcado,
  MarcadoEstado,
  AsistenciaEstado,
  TipoMarcado,
} from "../models/Marcado";

import { Horario } from "../models/Horario";

export class AbsenceService {
  private marcadoRepo = AppDataSource.getRepository(Marcado);

  private horarioRepo = AppDataSource.getRepository(Horario);

  async generarAusencias(): Promise<number> {
    const hoy = new Date().toISOString().split("T")[0];

    const horarios = await this.horarioRepo.find({
      relations: {
        paralelo: true,
      },
    });

    let creados = 0;

    for (const horario of horarios) {
      // horario sin paralelo
      if (!horario.paralelo) {
        continue;
      }

      const docenteId = horario.paralelo.docenteId;

      // paralelo sin docente
      if (!docenteId) {
        continue;
      }

      // ya existe marcado hoy
      const existe = await this.marcadoRepo.findOneBy({
        docenteId,
        horarioId: horario.id,
        fecha: hoy,
      });

      if (existe) {
        continue;
      }

      // crear ausencia automática
      const ausencia = new Marcado();

      ausencia.docenteId = docenteId;

      ausencia.horarioId = horario.id;

      ausencia.fecha = hoy;

      // obligatorio
      ausencia.horaInicio = new Date();

      ausencia.horaFin = new Date();

      // ← ESTE FALTABA
      ausencia.tipoMarcado = TipoMarcado.APP_HOSPITAL;

      ausencia.ubicacionId = null;

      ausencia.latitud = null;

      ausencia.longitud = null;

      ausencia.notas = "Ausencia automática";

      ausencia.estado = MarcadoEstado.RECHAZADO;

      ausencia.estadoAsistencia = AsistenciaEstado.AUSENTE;

      ausencia.minutosRetraso = 0;

      ausencia.minutosTrabajados = 0;

      ausencia.sincronizadoOffline = false;

      await this.marcadoRepo.save(ausencia);

      creados++;
    }

    return creados;
  }
}
