// src/validations/schemas.ts

import { z } from "zod";

/* ======================================================
   AUTH
====================================================== */

export const loginSchema = z.object({
  email: z.string().email("Email inválido").max(255),

  password: z.string().min(1, "Contraseña requerida"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token requerido"),
});

export const changePasswordSchema = z.object({
  nuevaPassword: z
    .string()

    .min(8, "Mínimo 8 caracteres")

    .max(255),
});

/* ======================================================
   DOCENTES
====================================================== */

export const docenteSchema = z.object({
  nombreCompleto: z.string().min(3, "Nombre demasiado corto").max(255),

  email: z.string().email("Email inválido").max(255),

  cedula: z.string().min(5, "Cédula inválida").max(20),

  departamento: z.string().min(2, "Departamento requerido").max(100),
});

/* ======================================================
   MATERIAS
====================================================== */

export const materiaSchema = z.object({
  nombre: z.string().min(2).max(255),

  codigo: z.string().min(1).max(50),

  creditos: z.number().int().min(1).max(20),

  semestre: z.number().int().min(1).max(12),
});

/* ======================================================
   PARALELOS
====================================================== */

export const paraleloSchema = z.object({
  materiaId: z.string().uuid(),

  docenteId: z.string().uuid(),

  numero: z.string().min(1).max(5),

  capacidad: z.number().int().positive().optional(),

  semestreAcademico: z
    .string()
    .regex(/^\d{4}-[12]$/, "Formato esperado: 2026-1"),
});

/* ======================================================
   HORARIOS
====================================================== */

export const horarioSchema = z.object({
  paraleloId: z.string().uuid(),

  diaSemana: z.number().int().min(0).max(6),

  horaInicio: z.string(),

  horaFin: z.string(),

  ubicacionId: z.string().uuid(),

  tipoActividad: z.enum(["clase", "laboratorio", "rote"]),
});

/* ======================================================
   UBICACIONES
====================================================== */

export const ubicacionSchema = z.object({
  nombre: z.string().min(2).max(255),

  tipo: z.enum(["aula", "laboratorio", "hospital"]),

  edificioCampus: z.string().optional(),

  capacidad: z.number().int().optional(),

  latitud: z.number().optional(),

  longitud: z.number().optional(),

  radioValidacion: z.number().int().optional(),
});

/* ======================================================
   MARCADOS
====================================================== */

export const marcadoSchema = z.object({
  docenteId: z.string().uuid(),

  horarioId: z.string().uuid().optional(),

  ubicacionId: z.string().uuid().optional(),

  tipoMarcado: z.enum([
    "biometrico",
    "app_campus",
    "app_laboratorio",
    "app_hospital",
  ]),

  latitud: z.number().optional(),

  longitud: z.number().optional(),

  notas: z.string().optional(),
});

// resetPasswordSchema
export const resetRequestSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),

  nuevaPassword: z.string().min(8),
});
