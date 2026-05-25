// src/services/horarioService.ts

import { Horario } from "../models/Horario";
import { AppError } from "../middlewares/errorHandler";
import { horarioSchema } from "../validations/schemas";
import { HorarioRepository } from "../repositories/horarioRepository";

export class HorarioService {
  private repository = new HorarioRepository();

  async obtenerTodos(): Promise<Horario[]> {
    return this.repository.findAll();
  }

  async obtenerPorId(id: string): Promise<Horario> {
    const horario = await this.repository.findById(id);

    if (!horario) {
      throw new AppError(404, "HORARIO_NO_ENCONTRADO", "Horario no encontrado");
    }

    return horario;
  }

  async obtenerPorParalelo(paraleloId: string): Promise<Horario[]> {
    return this.repository.findByParalelo(paraleloId);
  }

  async crear(data: unknown): Promise<Horario> {
    const body = horarioSchema.parse(data);

    return this.repository.create({
      paraleloId: body.paraleloId,

      diaSemana: body.diaSemana,

      horaInicio: body.horaInicio,

      horaFin: body.horaFin,

      ubicacionId: body.ubicacionId,

      tipoActividad: body.tipoActividad as any,
    });
  }

  async actualizar(id: string, data: unknown): Promise<Horario> {
    const body = horarioSchema.partial().parse(data);

    const horario = await this.repository.update(id, {
      paraleloId: body.paraleloId,

      diaSemana: body.diaSemana,

      horaInicio: body.horaInicio,

      horaFin: body.horaFin,

      ubicacionId: body.ubicacionId,

      tipoActividad: body.tipoActividad as any,
    });

    if (!horario) {
      throw new AppError(404, "HORARIO_NO_ENCONTRADO", "Horario no encontrado");
    }

    return horario;
  }

  async eliminar(id: string): Promise<void> {
    const eliminado = await this.repository.delete(id);

    if (!eliminado) {
      throw new AppError(404, "HORARIO_NO_ENCONTRADO", "Horario no encontrado");
    }
  }
}
