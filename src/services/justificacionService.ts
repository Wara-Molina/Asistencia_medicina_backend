// src/services/justificacionService.ts

import {
  Justificacion,
  JustificacionEstado,
  JustificacionTipo,
} from "../models/Justificacion";

import { JustificacionRepository } from "../repositories/justificacionRepository";

import { MarcadoRepository } from "../repositories/marcadoRepository";

import { AppError } from "../middlewares/errorHandler";

export class JustificacionService {
  private repo = new JustificacionRepository();

  private marcadoRepo = new MarcadoRepository();

  async obtenerTodas(): Promise<Justificacion[]> {
    return this.repo.findAll();
  }

  async solicitar(data: {
    marcadoId: string;

    docenteId: string;

    tipo: JustificacionTipo;

    motivo: string;

    archivo?: string;
  }) {
    const marcado = await this.marcadoRepo.findById(data.marcadoId);

    if (!marcado) {
      throw new AppError(404, "MARCADO_NO_ENCONTRADO", "Marcado inexistente");
    }

    return this.repo.create({
      marcadoId: data.marcadoId,

      docenteId: data.docenteId,

      tipo: data.tipo,

      motivo: data.motivo,

      archivo: data.archivo ?? null,

      estado: JustificacionEstado.PENDIENTE,

      observaciones: null,

      fechaRevision: null,
    });
  }

  async aprobar(id: string, observaciones?: string) {
    const item = await this.repo.findById(id);

    if (!item) {
      throw new AppError(404, "JUSTIFICACION_NO_ENCONTRADA", "No encontrada");
    }

    item.estado = JustificacionEstado.APROBADA;

    item.observaciones = observaciones ?? null;

    item.fechaRevision = new Date();

    const actualizado = await this.repo.save(item);

    return actualizado;
  }

  async rechazar(id: string, observaciones?: string) {
    const item = await this.repo.findById(id);

    if (!item) {
      throw new AppError(404, "JUSTIFICACION_NO_ENCONTRADA", "No encontrada");
    }

    item.estado = JustificacionEstado.RECHAZADA;

    item.observaciones = observaciones ?? null;

    item.fechaRevision = new Date();

    return this.repo.save(item);
  }
}
