// src/repositories/horarioRepository.ts
import { AppDataSource } from "../config/database";
import { Horario } from "../models/Horario";

export class HorarioRepository {
  private repository = AppDataSource.getRepository(Horario);

  async findAll(): Promise<Horario[]> {
    return this.repository.find({
      relations: {
        paralelo: {
          materia: true,
          docente: true,
        },

        ubicacion: true,
      },

      order: {
        diaSemana: "ASC",
      },
    });
  }

  async findById(id: string): Promise<Horario | null> {
    return this.repository.findOne({
      where: { id },

      relations: {
        paralelo: {
          materia: true,
          docente: true,
        },

        ubicacion: true,
        marcados: true,
      },
    });
  }

  async findByParalelo(paraleloId: string): Promise<Horario[]> {
    return this.repository.find({
      where: {
        paraleloId,
      },

      relations: {
        ubicacion: true,
      },
    });
  }
async findByDocente(
  docenteId: string,
): Promise<Horario[]> {

  console.log(
    "DOCENTE BUSCADO:",
    docenteId,
  );

  const resultado =
    await this.repository
      .createQueryBuilder("horario")
      .leftJoinAndSelect(
        "horario.paralelo",
        "paralelo",
      )
      .leftJoinAndSelect(
        "paralelo.materia",
        "materia",
      )
      .leftJoinAndSelect(
        "horario.ubicacion",
        "ubicacion",
      )
      .where(
        "paralelo.docenteId = :docenteId",
        { docenteId },
      )
      .getMany();

  console.log(
    "HORARIOS ENCONTRADOS:",
    resultado.length,
  );

  return resultado;
}

  async create(data: Partial<Horario>): Promise<Horario> {
    const horario = this.repository.create(data);

    return this.repository.save(horario);
  }

  async update(id: string, data: Partial<Horario>): Promise<Horario | null> {
    const horario = await this.findById(id);

    if (!horario) {
      return null;
    }

    Object.assign(horario, data);

    return this.repository.save(horario);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);

    return (result.affected ?? 0) > 0;
  }
}
