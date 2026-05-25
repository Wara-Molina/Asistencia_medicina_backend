// src/services/ubicacionService.ts
import { Ubicacion } from "../models/Ubicacion";
import { AppError } from "../middlewares/errorHandler";
import { ubicacionSchema } from "../validations/schemas";
import { UbicacionRepository } from "../repositories/ubicacionRepository";

export class UbicacionService {
  private repository = new UbicacionRepository();

  async obtenerTodas(): Promise<Ubicacion[]> {
    return this.repository.findAll();
  }

  async obtenerPorId(id: string): Promise<Ubicacion> {
    const ubicacion = await this.repository.findById(id);

    if (!ubicacion) {
      throw new AppError(
        404,
        "UBICACION_NO_ENCONTRADA",
        "Ubicación no encontrada",
      );
    }

    return ubicacion;
  }

  async crear(data: unknown): Promise<Ubicacion> {
    const body = ubicacionSchema.parse(data);

    return this.repository.create({
      nombre: body.nombre,

      tipo: body.tipo as any,

      edificioCampus: body.edificioCampus ?? null,

      capacidad: body.capacidad ?? null,

      latitud: body.latitud ?? null,

      longitud: body.longitud ?? null,

      radioValidacion: body.radioValidacion ?? 300,
    });
  }

  async actualizar(id: string, data: unknown): Promise<Ubicacion> {
    const body = ubicacionSchema.partial().parse(data);

    const ubicacion = await this.repository.update(id, {
      nombre: body.nombre,

      tipo: body.tipo as any,

      edificioCampus: body.edificioCampus,

      capacidad: body.capacidad,

      latitud: body.latitud,

      longitud: body.longitud,

      radioValidacion: body.radioValidacion,
    });

    if (!ubicacion) {
      throw new AppError(
        404,
        "UBICACION_NO_ENCONTRADA",
        "Ubicación no encontrada",
      );
    }

    return ubicacion;
  }

  async eliminar(id: string): Promise<void> {
    const eliminado = await this.repository.delete(id);

    if (!eliminado) {
      throw new AppError(
        404,
        "UBICACION_NO_ENCONTRADA",
        "Ubicación no encontrada",
      );
    }
  }
}
