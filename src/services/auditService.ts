// src/services/auditService.ts

import { Audit } from "../models/Audit";
import { AuditRepository } from "../repositories/auditRepository";

export class AuditService {
  private repository = new AuditRepository();

  async registrar(
    accion: string,

    entidad: string,

    entidadId?: string,

    usuarioId?: string,

    datos?: any,
  ): Promise<Audit> {
    return this.repository.create({
      usuarioId: usuarioId ?? null,

      accion,

      entidad,

      entidadId: entidadId ?? null,

      datos: datos ?? null,
    });
  }

  async obtenerTodos(): Promise<Audit[]> {
    return this.repository.findAll();
  }
}
