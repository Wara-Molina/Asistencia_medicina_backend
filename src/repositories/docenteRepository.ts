// src/repositories/docenteRepository.ts
import { AppDataSource } from "../config/database";
import { Docente } from "../models/Docente";

export class DocenteRepository {
  private repository = AppDataSource.getRepository(Docente);

  async findAll(): Promise<Docente[]> {
    return this.repository.find({
      order: {
        fechaCreacion: "DESC",
      },
    });
  }

  async findById(id: string): Promise<Docente | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Docente | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  async create(data: Partial<Docente>): Promise<Docente> {
    const docente = this.repository.create(data);

    return this.repository.save(docente);
  }

  async update(id: string, data: Partial<Docente>): Promise<Docente | null> {
    const docente = await this.findById(id);

    if (!docente) {
      return null;
    }

    Object.assign(docente, data);

    return this.repository.save(docente);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);

    return (result.affected ?? 0) > 0;
  }

  async findByCedula(cedula: string): Promise<Docente | null> {
    return this.repository.findOne({
      where: { cedula },
    });
  }

  async exists(email: string, cedula: string): Promise<boolean> {
    const docente = await this.repository.findOne({
      where: [{ email }, { cedula }],
    });

    return !!docente;
  }
}
