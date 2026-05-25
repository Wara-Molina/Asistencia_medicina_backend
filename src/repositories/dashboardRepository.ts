// src/repositories/dashboardRepository.ts
import { AppDataSource } from "../config/database";

import { Docente } from "../models/Docente";
import { Materia } from "../models/Materia";
import { Marcado } from "../models/Marcado";

export class DashboardRepository {
  docenteRepo = AppDataSource.getRepository(Docente);

  materiaRepo = AppDataSource.getRepository(Materia);

  marcadoRepo = AppDataSource.getRepository(Marcado);
}
