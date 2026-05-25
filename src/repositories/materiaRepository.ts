// src/repositories/materiaRepository.ts
import { AppDataSource } from "../config/database";
import { Materia } from "../models/Materia";

export class MateriaRepository {
  private repository = AppDataSource.getRepository(Materia);

  async findAll(): Promise<Materia[]> {
    return this.repository.find({
      order: {
        semestre: "ASC",
        nombre: "ASC",
      },
    });
  }

  async findById(id: string): Promise<Materia | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByCodigo(codigo: string): Promise<Materia | null> {
    return this.repository.findOne({
      where: { codigo },
    });
  }

  async exists(codigo: string): Promise<boolean> {
    const materia = await this.findByCodigo(codigo);

    return !!materia;
  }

  async create(data: Partial<Materia>): Promise<Materia> {
    const materia = this.repository.create(data);

    return this.repository.save(materia);
  }

  async update(id: string, data: Partial<Materia>): Promise<Materia | null> {
    const materia = await this.findById(id);

    if (!materia) {
      return null;
    }

    Object.assign(materia, data);

    return this.repository.save(materia);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);

    return (result.affected ?? 0) > 0;
  }
}
