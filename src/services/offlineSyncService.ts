// src/services/offlineSyncService.ts

import { Marcado } from "../models/Marcado";

export interface OfflineMarcado {
  docenteId: string;

  horarioId?: string;

  ubicacionId?: string;

  fecha: string;

  horaInicio: string;

  horaFin?: string;

  latitud?: number;

  longitud?: number;

  notas?: string;
}

export class OfflineSyncService {
  prepararSincronizacion(marcados: OfflineMarcado[]): Partial<Marcado>[] {
    return marcados.map((m) => ({
      docenteId: m.docenteId,

      horarioId: m.horarioId ?? null,

      ubicacionId: m.ubicacionId ?? null,

      fecha: m.fecha,

      horaInicio: new Date(m.horaInicio),

      horaFin: m.horaFin ? new Date(m.horaFin) : null,

      latitud: m.latitud ?? null,

      longitud: m.longitud ?? null,

      notas: m.notas ?? null,

      sincronizadoOffline: true,
    }));
  }

  detectarPendientes(marcados: Marcado[]): Marcado[] {
    return marcados.filter((m) => !m.sincronizadoOffline);
  }
}
