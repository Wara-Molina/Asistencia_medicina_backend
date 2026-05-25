// src/repositories/paraleloRepository.ts
import { AppDataSource } from "../config/database";
import { Paralelo } from "../models/Paralelo";

export class ParaleloRepository {
  private repository = AppDataSource.getRepository(Paralelo);

  async findAll(): Promise<Paralelo[]> {
    return this.repository.find({
      relations: {
        materia: true,
        docente: true,
      },

      order: {
        semestreAcademico: "DESC",
      },
    });
  }

  async findById(id: string): Promise<Paralelo | null> {
    return this.repository.findOne({
      where: { id },

      relations: {
        materia: true,
        docente: true,
        horarios: true,
      },
    });
  }

  async create(data: Partial<Paralelo>): Promise<Paralelo> {
    const paralelo = this.repository.create(data);

    return this.repository.save(paralelo);
  }

  async update(id: string, data: Partial<Paralelo>): Promise<Paralelo | null> {
    const paralelo = await this.findById(id);

    if (!paralelo) {
      return null;
    }

    Object.assign(paralelo, data);

    return this.repository.save(paralelo);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);

    return (result.affected ?? 0) > 0;
  }

  async findBySemestre(semestre: string): Promise<Paralelo[]> {
    return this.repository.find({
      where: {
        semestreAcademico: semestre,
      },

      relations: {
        materia: true,
        docente: true,
      },
    });
  }
}
