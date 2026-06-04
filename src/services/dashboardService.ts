// src/services/dashboardService.ts

import { DashboardRepository } from "../repositories/dashboardRepository";

import { Dashboard } from "../types/Dashboard";

import { MarcadoEstado } from "../models/Marcado";

export class DashboardService {
  private repository = new DashboardRepository();

  async obtenerDashboard(): Promise<Dashboard> {
    const totalDocentes = await this.repository.docenteRepo.count();

    const totalMaterias = await this.repository.materiaRepo.count();

    const marcados = await this.repository.marcadoRepo.find();

    const validos = marcados.filter(
      (m) => m.estado === MarcadoEstado.VALIDO,
    ).length;

    const rechazados = marcados.filter(
      (m) => m.estado === MarcadoEstado.RECHAZADO,
    ).length;

const posiblesAbandonos = marcados.filter(
  m => m.estado === MarcadoEstado.POSIBLE_ABANDONO,
).length;

const abandonosConfirmados = marcados.filter(
  m => m.estado === MarcadoEstado.ABANDONO_CONFIRMADO,
).length;

    const porcentajeGlobal =
      marcados.length === 0
        ? 0
        : Number(((validos / marcados.length) * 100).toFixed(2));

    return {
      totalDocentes,

      totalMaterias,

      totalMarcados: marcados.length,

      validos,

      rechazados,
      abandonos: posiblesAbandonos + abandonosConfirmados,

      porcentajeGlobal,
    };
  }
}
