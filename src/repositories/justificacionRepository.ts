// src/repositories/justificacionRepository.ts
import { AppDataSource } from "../config/database";

import { Justificacion } from "../models/Justificacion";

export class JustificacionRepository {
  private repo = AppDataSource.getRepository(Justificacion);

  findAll() {
    return this.repo.find();
  }

  findById(id: string) {
    return this.repo.findOneBy({
      id,
    });
  }

  create(data: Partial<Justificacion>) {
    const entity = this.repo.create(data);

    return this.repo.save(entity);
  }

  save(entity: Justificacion) {
    return this.repo.save(entity);
  }
}
