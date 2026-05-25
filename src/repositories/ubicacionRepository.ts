// src/repositories/ubicacionRepository.ts
import { AppDataSource } from "../config/database";
import { Ubicacion } from "../models/Ubicacion";

export class UbicacionRepository {
  private repository = AppDataSource.getRepository(Ubicacion);

  async findAll(): Promise<Ubicacion[]> {
    return this.repository.find({
      order: {
        nombre: "ASC",
      },
    });
  }

  async findById(id: string): Promise<Ubicacion | null> {
    return this.repository.findOne({
      where: { id },

      relations: {
        horarios: true,
        marcados: true,
      },
    });
  }

  async create(data: Partial<Ubicacion>): Promise<Ubicacion> {
    const ubicacion = this.repository.create(data);

    return this.repository.save(ubicacion);
  }

  async update(
    id: string,
    data: Partial<Ubicacion>,
  ): Promise<Ubicacion | null> {
    const ubicacion = await this.findById(id);

    if (!ubicacion) {
      return null;
    }

    Object.assign(ubicacion, data);

    return this.repository.save(ubicacion);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);

    return (result.affected ?? 0) > 0;
  }
}
