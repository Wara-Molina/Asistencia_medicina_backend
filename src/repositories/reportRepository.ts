// src/repositories/reportRepository.ts
import { AppDataSource } from "../config/database";
import { Marcado, MarcadoEstado } from "../models/Marcado";

export class ReportRepository {
  private repo = AppDataSource.getRepository(Marcado);

  async obtenerMarcadosDocente(docenteId: string): Promise<Marcado[]> {
    return this.repo.find({
      where: {
        docenteId,
      },

      relations: ["docente"],

      order: {
        fechaCreacion: "DESC",
      },
    });
  }

  async obtenerTodos(): Promise<Marcado[]> {
    return this.repo.find({
      relations: ["docente"],
    });
  }
}
