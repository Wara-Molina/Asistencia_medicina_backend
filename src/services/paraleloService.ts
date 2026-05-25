// src/services/paraleloService.ts
import { Paralelo } from "../models/Paralelo";
import { AppError } from "../middlewares/errorHandler";
import { paraleloSchema } from "../validations/schemas";
import { ParaleloRepository } from "../repositories/paraleloRepository";

export class ParaleloService {
  private repository = new ParaleloRepository();

  async obtenerTodos(semestre?: string): Promise<Paralelo[]> {
    if (semestre) {
      return this.repository.findBySemestre(semestre);
    }

    return this.repository.findAll();
  }

  async obtenerPorId(id: string): Promise<Paralelo> {
    const paralelo = await this.repository.findById(id);

    if (!paralelo) {
      throw new AppError(
        404,
        "PARALELO_NO_ENCONTRADO",
        "Paralelo no encontrado",
      );
    }

    return paralelo;
  }

  async crear(data: unknown): Promise<Paralelo> {
    const body = paraleloSchema.parse(data);

    return this.repository.create(body);
  }

  async actualizar(id: string, data: unknown): Promise<Paralelo> {
    const body = paraleloSchema.partial().parse(data);

    const paralelo = await this.repository.update(id, body);

    if (!paralelo) {
      throw new AppError(
        404,
        "PARALELO_NO_ENCONTRADO",
        "Paralelo no encontrado",
      );
    }

    return paralelo;
  }

  async eliminar(id: string): Promise<void> {
    const eliminado = await this.repository.delete(id);

    if (!eliminado) {
      throw new AppError(
        404,
        "PARALELO_NO_ENCONTRADO",
        "Paralelo no encontrado",
      );
    }
  }
}
