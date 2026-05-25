// src/repositories/marcadoRepository.ts
import { AppDataSource } from "../config/database";
import { Marcado } from "../models/Marcado";

export class MarcadoRepository {
  private repository = AppDataSource.getRepository(Marcado);

  async findAll(): Promise<Marcado[]> {
    return this.repository.find({
      relations: {
        docente: true,
        horario: true,
        ubicacion: true,
      },

      order: {
        fechaCreacion: "DESC",
      },
    });
  }

  async findById(id: string): Promise<Marcado | null> {
    return this.repository.findOne({
      where: { id },

      relations: {
        docente: true,
        horario: true,
        ubicacion: true,
      },
    });
  }

  async findByDocente(docenteId: string): Promise<Marcado[]> {
    return this.repository.find({
      where: {
        docenteId,
      },

      relations: {
        horario: true,
        ubicacion: true,
      },

      order: {
        fechaCreacion: "DESC",
      },
    });
  }

  async create(data: Partial<Marcado>): Promise<Marcado> {
    const marcado = this.repository.create(data);

    return this.repository.save(marcado);
  }

  async update(id: string, data: Partial<Marcado>): Promise<Marcado | null> {
    const marcado = await this.findById(id);

    if (!marcado) {
      return null;
    }

    Object.assign(marcado, data);

    return this.repository.save(marcado);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);

    return (result.affected ?? 0) > 0;
  }
}
