// src/services/materiaService.ts

import { Materia } from "../models/Materia";

import { AppError } from "../middlewares/errorHandler";

import { materiaSchema } from "../validations/schemas";

import { MateriaRepository } from "../repositories/materiaRepository";

import { AuditService } from "./auditService";

export class MateriaService {
  private repository = new MateriaRepository();

  private auditService = new AuditService();

  /* =====================================================
     OBTENER TODAS
  ===================================================== */

  async obtenerTodas(): Promise<Materia[]> {
    return this.repository.findAll();
  }

  /* =====================================================
     OBTENER POR ID
  ===================================================== */

  async obtenerPorId(id: string): Promise<Materia> {
    const materia = await this.repository.findById(id);

    if (!materia) {
      throw new AppError(
        404,

        "MATERIA_NO_ENCONTRADA",

        "Materia no encontrada",
      );
    }

    return materia;
  }

  /* =====================================================
     CREAR
  ===================================================== */

  async crear(data: unknown): Promise<Materia> {
    const body = materiaSchema.parse(data);

    const existe = await this.repository.exists(body.codigo);

    if (existe) {
      throw new AppError(
        409,

        "MATERIA_EXISTE",

        "Código ya registrado",
      );
    }

    const materia = await this.repository.create(body);

    // AUDITORÍA

    await this.auditService.registrar(
      "CREAR",

      "MATERIA",

      materia.id,

      undefined,

      {
        nombre: materia.nombre,

        codigo: materia.codigo,

        semestre: materia.semestre,

        creditos: materia.creditos,
      },
    );

    return materia;
  }

  /* =====================================================
     ACTUALIZAR
  ===================================================== */

  async actualizar(
    id: string,

    data: unknown,
  ): Promise<Materia> {
    const body = materiaSchema.partial().parse(data);

    const materia = await this.repository.update(id, body);

    if (!materia) {
      throw new AppError(
        404,

        "MATERIA_NO_ENCONTRADA",

        "Materia no encontrada",
      );
    }

    // AUDITORÍA

    await this.auditService.registrar(
      "ACTUALIZAR",

      "MATERIA",

      materia.id,

      undefined,

      {
        nombre: materia.nombre,

        codigo: materia.codigo,

        semestre: materia.semestre,
      },
    );

    return materia;
  }

  /* =====================================================
     ELIMINAR
  ===================================================== */

  async eliminar(id: string): Promise<void> {
    const eliminado = await this.repository.delete(id);

    if (!eliminado) {
      throw new AppError(
        404,

        "MATERIA_NO_ENCONTRADA",

        "Materia no encontrada",
      );
    }

    // AUDITORÍA

    await this.auditService.registrar(
      "ELIMINAR",

      "MATERIA",

      id,
    );
  }
}
