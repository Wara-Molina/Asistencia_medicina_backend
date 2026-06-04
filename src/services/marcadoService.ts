// src/services/marcadoService.ts

import {
  Marcado,
  MarcadoEstado,
  TipoMarcado,
  AsistenciaEstado,
} from "../models/Marcado";

import { Horario } from "../models/Horario";

import { AppError } from "../middlewares/errorHandler";

import { marcadoSchema } from "../validations/schemas";

import { MarcadoRepository } from "../repositories/marcadoRepository";

import { ValidationService } from "./validationService";

import { AuditService } from "./auditService";

import { AppDataSource } from "../config/database";

import { Ubicacion, UbicacionTipo } from "../models/Ubicacion";
import { LocationValidationService } from "./locationValidationService";
export class MarcadoService {
  private repository = new MarcadoRepository();

  private validationService = new ValidationService();
  private locationService = new LocationValidationService();
  private auditService = new AuditService();

  private ubicacionRepo = AppDataSource.getRepository(Ubicacion);

  private horarioRepo = AppDataSource.getRepository(Horario);

  /* ===========================
     OBTENER TODOS
  =========================== */

  async obtenerTodos(): Promise<Marcado[]> {
    return this.repository.findAll();
  }

  /* ===========================
     OBTENER POR ID
  =========================== */

  async obtenerPorId(id: string): Promise<Marcado> {
    const marcado = await this.repository.findById(id);

    if (!marcado) {
      throw new AppError(
        404,

        "MARCADO_NO_ENCONTRADO",

        "Marcado no encontrado",
      );
    }

    const abandono = this.validationService.detectarAbandono(marcado);

    if (abandono === MarcadoEstado.POSIBLE_ABANDONO) {
      marcado.estado = MarcadoEstado.POSIBLE_ABANDONO;
    }

    return marcado;
  }

  /* ===========================
     DOCENTE
  =========================== */

  async obtenerPorDocente(docenteId: string): Promise<Marcado[]> {
    return this.repository.findByDocente(docenteId);
  }

  /* ===========================
     CREAR
  =========================== */

  async crear(data: unknown): Promise<Marcado> {
    const body = marcadoSchema.parse(data);
    const marcadoActivo =
  await this.repository.findMarcadoActivo(
    body.docenteId,
  );

if (marcadoActivo) {
  throw new AppError(
    400,
    "MARCADO_ACTIVO",
    "Ya existe una asistencia abierta",
  );
}

    const ahora = new Date();

    let estado = MarcadoEstado.VALIDANDO;

    let estadoAsistencia: AsistenciaEstado | null = null;

    let minutosRetraso = 0;

    let minutosTrabajados = 0;

    /* ==========================
   VALIDACIÓN GPS
========================== */

    if (body.ubicacionId) {
      const ubicacion = await this.ubicacionRepo.findOneBy({
        id: body.ubicacionId,
      });

      if (ubicacion && ubicacion.tipo === UbicacionTipo.HOSPITAL) {
        /* GPS obligatorio */

        if (body.latitud == null || body.longitud == null) {
          throw new AppError(400, "GPS_REQUERIDO", "Hospital requiere GPS");
        }

        const esValido = await this.locationService.validarDistancia(
          ubicacion.id,

          body.latitud,

          body.longitud,
        );

        const distancia = await this.locationService.distanciaMetros(
          ubicacion.id,

          body.latitud,

          body.longitud,
        );

        estado = esValido ? MarcadoEstado.VALIDO : MarcadoEstado.RECHAZADO;

        if (!esValido) {
          throw new AppError(
            400,

            "FUERA_DE_RANGO",

            `Fuera del radio permitido (${Math.round(distancia)}m)`,
          );
        }
      }
    }

    /* ==========================
     TARDANZA CORREGIDA
  ========================== */

    if (body.horarioId) {
      const horario = await this.horarioRepo.findOneBy({
        id: body.horarioId,
      });

      if (horario) {
        /* ==========================
   VALIDACIÓN DÍA Y HORARIO
========================== */

        /*   Nota: si hay horarios despues de media noche modificar */

        const diaActual = ahora.getDay();

        const diaSistema = diaActual === 0 ? 6 : diaActual - 1;

        if (horario.diaSemana !== diaSistema) {
          throw new AppError(
            400,
            "DIA_INVALIDO",
            "No existe horario asignado para el día actual",
          );
        }

        const [horaInicio, minutoInicio] = horario.horaInicio
          .split(":")
          .map(Number);

        const [horaFin, minutoFin] = horario.horaFin.split(":").map(Number);

        const inicioPermitido = new Date();
        inicioPermitido.setHours(horaInicio, minutoInicio - 10, 0, 0);

        const finPermitido = new Date();
        finPermitido.setHours(horaFin, minutoFin + 10, 59, 999);

        if (
          ahora.getTime() < inicioPermitido.getTime() ||
          ahora.getTime() > finPermitido.getTime()
        ) {
          throw new AppError(
            400,
            "FUERA_DE_HORARIO",
            "El horario no está habilitado para registrar asistencia",
          );
        }

        const inicioProgramado = new Date();

        inicioProgramado.setHours(horaInicio, minutoInicio, 0, 0);

        const diferencia = Math.floor(
          (ahora.getTime() - inicioProgramado.getTime()) / 60000,
        );

        /* antes del inicio */
        if (diferencia < 0) {
          minutosRetraso = 0;

          estadoAsistencia = AsistenciaEstado.PRESENTE;
        } else if (diferencia <= 10) {
          /* tolerancia */
          minutosRetraso = diferencia;

          estadoAsistencia = AsistenciaEstado.PRESENTE;
        } else {
          /* tardanza real */
          minutosRetraso = diferencia;

          estadoAsistencia = AsistenciaEstado.TARDANZA;
        }
      }
    }
    /* ==========================
   PREVENIR DOBLE MARCADO
========================== */

    if (body.horarioId) {
      const marcadoExistente = await this.repository.findByDocenteHorarioFecha(
        body.docenteId,
        body.horarioId,
        ahora.toISOString().split("T")[0],
      );

      if (marcadoExistente) {
        throw new AppError(
          409,
          "MARCADO_DUPLICADO",
          "Ya existe un marcado registrado para este horario",
        );
      }
    }
    /* ==========================
     CREAR MARCADO
  ========================== */

    const marcado = await this.repository.create({
      docenteId: body.docenteId,

      horarioId: body.horarioId ?? null,

      ubicacionId: body.ubicacionId ?? null,

      fecha: ahora.toISOString().split("T")[0],

      horaInicio: ahora,

      horaFin: null,

      tipoMarcado: body.tipoMarcado as TipoMarcado,

      latitud: body.latitud ?? null,

      longitud: body.longitud ?? null,

      notas: body.notas ?? null,

      estado,

      estadoAsistencia,

      minutosRetraso,

      minutosTrabajados,

      sincronizadoOffline: false,
    });

    await this.auditService.registrar(
      "MARCADO_ENTRADA",

      "ASISTENCIA",

      marcado.id,

      undefined,

      {
        docenteId: marcado.docenteId,

        horarioId: marcado.horarioId,

        estado: marcado.estado,

        asistencia: marcado.estadoAsistencia,

        retraso: marcado.minutosRetraso,
      },
    );

    return marcado;
  }

  /* ===========================
   FINALIZAR
=========================== */

  async finalizar(id: string): Promise<Marcado> {
    const actual = await this.obtenerPorId(id);

    const ahora = new Date();

    let minutosTrabajados = 0;

    let estadoAsistencia = actual.estadoAsistencia;

    /* -------------------
     HORAS TRABAJADAS
  ------------------- */

    if (actual.horaInicio) {
      minutosTrabajados = Math.floor(
        (ahora.getTime() - new Date(actual.horaInicio).getTime()) / 60000,
      );
    }

    /* -------------------
     SALIDA ANTICIPADA
  ------------------- */

    if (actual.horarioId) {
      const horario = await this.horarioRepo.findOneBy({
        id: actual.horarioId,
      });

      if (horario) {
        const [horaFin, minutoFin] = horario.horaFin.split(":").map(Number);

        if (!actual.horaInicio) {
          throw new AppError(
            400,
            "SIN_HORA_ENTRADA",
            "El marcado no tiene hora de entrada",
          );
        }

        const salidaProgramada = new Date(actual.horaInicio);

        salidaProgramada.setHours(salidaProgramada.getHours() + 4);

        const horaEntrada = new Date(actual.horaInicio).getHours();

        if (horaFin < horaEntrada) {
          salidaProgramada.setDate(salidaProgramada.getDate() + 1);
        }

        const diferencia = Math.floor(
          (salidaProgramada.getTime() - ahora.getTime()) / 60000,
        );

        if (diferencia > 10) {
          estadoAsistencia = AsistenciaEstado.SALIDA_ANTICIPADA;
        }
      }
    }

    /* -------------------
     ABANDONO
  ------------------- */

    if (actual.estado === MarcadoEstado.POSIBLE_ABANDONO) {
      estadoAsistencia = AsistenciaEstado.ABANDONO;
    }

    const marcado = await this.repository.update(
      id,

      {
        horaFin: ahora,

        minutosTrabajados,

        estadoAsistencia,

        estado:
          actual.estado === MarcadoEstado.POSIBLE_ABANDONO
            ? MarcadoEstado.POSIBLE_ABANDONO
            : MarcadoEstado.VALIDO,
      },
    );

    if (!marcado) {
      throw new AppError(
        404,

        "MARCADO_NO_ENCONTRADO",

        "Marcado no encontrado",
      );
    }

    await this.auditService.registrar(
      "MARCADO_SALIDA",

      "ASISTENCIA",

      marcado.id,

      undefined,

      {
        docenteId: marcado.docenteId,

        minutos: marcado.minutosTrabajados,

        asistencia: marcado.estadoAsistencia,
      },
    );

    return marcado;
  }

  /* ===========================
     ELIMINAR
  =========================== */

  async eliminar(id: string): Promise<void> {
    const eliminado = await this.repository.delete(id);

    if (!eliminado) {
      throw new AppError(
        404,

        "MARCADO_NO_ENCONTRADO",

        "Marcado no encontrado",
      );
    }
  }

async confirmarAbandono(
  id: string,
): Promise<void> {

  const marcado =
    await this.repository.confirmarAbandono(id);

  if (!marcado) {
    throw new AppError(
      404,
      "MARCADO_NO_ENCONTRADO",
      "Marcado no encontrado",
    );
  }
}

async rechazarAbandono(
  id: string,
): Promise<void> {

  const marcado =
    await this.repository.rechazarAbandono(id);

  if (!marcado) {
    throw new AppError(
      404,
      "MARCADO_NO_ENCONTRADO",
      "Marcado no encontrado",
    );
  }
}
async obtenerAbandonosPendientes() {
  return this.repository.obtenerAbandonosPendientes();
}

async obtenerMarcadoActivo(
  docenteId: string,
) {
  return this.repository.findMarcadoActivo(
    docenteId,
  );
}
}
