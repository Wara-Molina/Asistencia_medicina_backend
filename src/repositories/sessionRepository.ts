// src/repositories/sessionRepository.ts
import { AppDataSource } from "../config/database";

import { Sesion } from "../models/Sesion";

export class SessionRepository {
  private repo = AppDataSource.getRepository(Sesion);

  async crear(data: Partial<Sesion>): Promise<Sesion> {
    const sesion = this.repo.create(data);

    return this.repo.save(sesion);
  }

  async obtenerActivas(usuarioId: string): Promise<Sesion[]> {
    return this.repo.find({
      where: {
        usuarioId,

        activa: true,
      },

      order: {
        fechaCreacion: "DESC",
      },
    });
  }

  async cerrar(id: string): Promise<void> {
    await this.repo.update(
      id,

      {
        activa: false,
      },
    );
  }

  async cerrarTodas(usuarioId: string): Promise<void> {
    await this.repo.update(
      {
        usuarioId,

        activa: true,
      },

      {
        activa: false,
      },
    );
  }
}
