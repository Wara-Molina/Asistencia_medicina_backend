// src/repositories/controlPermanenciaRepository.ts
import { AppDataSource } from "../config/database";
import { ControlPermanencia } from "../models/ControlPermanencia";

export class ControlPermanenciaRepository {
  private repository =
    AppDataSource.getRepository(ControlPermanencia);

  async create(
    data: Partial<ControlPermanencia>,
  ): Promise<ControlPermanencia> {
    const control = this.repository.create(data);

    return this.repository.save(control);
  }

  async findByMarcado(
    marcadoId: string,
  ): Promise<ControlPermanencia[]> {
    return this.repository.find({
      where: {
        marcadoId,
      },

      order: {
        fechaControl: "DESC",
      },
    });
  }

  async obtenerUltimosControles(
    marcadoId: string,
    limite = 3,
  ): Promise<ControlPermanencia[]> {
    return this.repository.find({
      where: {
        marcadoId,
      },

      order: {
        fechaControl: "DESC",
      },

      take: limite,
    });
  }


async contarUltimosFueraDeRango(
  marcadoId: string,
): Promise<number> {
  const controles =
    await this.obtenerUltimosControles(
      marcadoId,
      3,
    );

  return controles.filter(
    (c) => !c.dentroPerimetro,
  ).length;
}
async findByMarcadoId(
  marcadoId: string,
): Promise<ControlPermanencia[]> {
  return this.repository.find({
    where: {
      marcadoId,
    },

    order: {
      fechaControl: "ASC",
    },
  });
}
}