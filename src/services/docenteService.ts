// src/services/docenteService.ts

import { Docente, DocenteEstado } from "../models/Docente";
import { Usuario, UsuarioRol } from "../models/Usuario";
import { DocenteRepository } from "../repositories/docenteRepository";
import { AppError } from "../middlewares/errorHandler";
import { docenteSchema } from "../validations/schemas";
import { hashPassword } from "./authService";
import { AppDataSource } from "../config/database";
import { AuditService } from "./auditService";

export class DocenteService {
  private docenteRepository = new DocenteRepository();
  private auditService = new AuditService();
  private usuarioRepository = AppDataSource.getRepository(Usuario);

  async obtenerTodos(): Promise<Docente[]> {
    return this.docenteRepository.findAll();
  }

  async obtenerPorId(id: string): Promise<Docente> {
    const docente = await this.docenteRepository.findById(id);

    if (!docente) {
      throw new AppError(404, "DOCENTE_NO_ENCONTRADO", "Docente no encontrado");
    }

    return docente;
  }

  async crear(data: unknown) {
    const body = docenteSchema.parse(data);

    // validar email
    const existeEmail = await this.docenteRepository.findByEmail(body.email);

    if (existeEmail) {
      throw new AppError(
        409,
        "DOCENTE_EXISTE",
        "Ya existe un docente con ese email",
      );
    }

    // validar cédula
    const existeCedula = await this.docenteRepository.findByCedula(body.cedula);

    if (existeCedula) {
      throw new AppError(
        409,
        "CEDULA_EXISTE",
        "Ya existe un docente con esa cédula",
      );
    }

    const docente = await this.docenteRepository.create({
      ...body,
      estado: DocenteEstado.ACTIVO,
    });

    await this.auditService.registrar(
      "CREAR",
      "DOCENTE",
      docente.id,
      undefined,
      {
        nombre: docente.nombreCompleto,

        email: docente.email,
      },
    );

    await this.usuarioRepository.save(
      this.usuarioRepository.create({
        email: body.email,

        password: await hashPassword(body.cedula),

        rol: UsuarioRol.DOCENTE,

        docenteId: docente.id,

        nombreCompleto: body.nombreCompleto,
      }),
    );

    return {
      docente,

      credencialesIniciales: {
        email: body.email,

        password: body.cedula,

        nota: "El docente debe cambiar contraseña en el primer acceso",
      },
    };
  }

  async actualizar(id: string, data: Partial<Docente>): Promise<Docente> {
    const docente = await this.docenteRepository.update(id, data);

    if (!docente) {
      throw new AppError(404, "DOCENTE_NO_ENCONTRADO", "Docente no encontrado");
    }
    await this.auditService.registrar(
      "ACTUALIZAR",

      "DOCENTE",

      docente.id,

      undefined,

      {
        nombre: docente.nombreCompleto,
      },
    );
    return docente;
  }

  async eliminar(id: string): Promise<void> {
    const eliminado = await this.docenteRepository.delete(id);

    if (!eliminado) {
      throw new AppError(404, "DOCENTE_NO_ENCONTRADO", "Docente no encontrado");
    }
    await this.auditService.registrar(
      "ELIMINAR",

      "DOCENTE",

      id,
    );
  }
}
