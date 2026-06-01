// src/jobs/asistenciaScheduler.ts

import { AppDataSource } from "../config/database";

import { Horario } from "../models/Horario";

import {
  Marcado,
  TipoMarcado,
  MarcadoEstado,
  AsistenciaEstado,
} from "../models/Marcado";

export class AsistenciaScheduler {
  async marcarAusentes() {
    const hRepo = AppDataSource.getRepository(Horario);

    const mRepo = AppDataSource.getRepository(Marcado);

    const horarios = await hRepo.find({
      relations: ["paralelo"],
    });

    const hoy = new Date().toISOString().split("T")[0];

    for (const horario of horarios) {
      const existe = await mRepo.findOne({
        where: {
          horarioId: horario.id,

          fecha: hoy,
        },
      });

      if (existe) {
        continue;
      }

      const nuevo = mRepo.create({
        docenteId: horario.paralelo.docenteId,

        horarioId: horario.id,

        fecha: hoy,

        horaInicio: null,

        horaFin: null,

        tipoMarcado: TipoMarcado.AUTOMATICO,

        estado: MarcadoEstado.RECHAZADO,

        estadoAsistencia: AsistenciaEstado.AUSENTE,

        minutosRetraso: 0,

        minutosTrabajados: 0,
      });

      await mRepo.save(nuevo);

      console.log("AUSENTE:", horario.id);
    }
  }
}
