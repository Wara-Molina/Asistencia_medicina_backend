// src/repositories/auditRepository.ts
import { AppDataSource } from "../config/database";

import { Audit } from "../models/Audit";

export class AuditRepository {
  private repo = AppDataSource.getRepository(Audit);

  async create(data: Partial<Audit>): Promise<Audit> {
    const audit = this.repo.create(data);

    return this.repo.save(audit);
  }

  async findAll(): Promise<Audit[]> {
    return this.repo.find({
      order: {
        fechaCreacion: "DESC",
      },
    });
  }
}
