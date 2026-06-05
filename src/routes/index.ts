// src/routes/index.ts
import { Router } from "express";
import { autenticar, autorizar } from "../middlewares/auth";
import { UsuarioRol } from "../models/Usuario";
import {
  obtenerResumen,
  obtenerReporteDocente,
  obtenerRanking,
  obtenerDashboardDirector,

} from "../controllers/reportController";


// Controllers
import { login, refreshToken, logout } from "../controllers/authController";
import {
  getMarcados,
  getMarcado,
  getMarcadosDocente,
  registrarMarcado,
  marcarSalida,
  eliminarMarcado,
  confirmarAbandono,
  rechazarAbandono,
  obtenerAbandonosPendientes, 
   obtenerMarcadoActivo, 
} from "../controllers/marcadoController";
import controlPermanenciaRoutes
from "./controlPermanenciaRoutes";
import {
  getDocentes,
  getDocente,
  crearDocente,
  actualizarDocente,
} from "../controllers/docenteController";
import {
  getHorarios,
  getHorario,
  getHorariosParalelo,
  getHorariosDocente,
  crearHorario,
  actualizarHorario,
  eliminarHorario,
} from "../controllers/horarioController";
import {
  getUbicaciones,
  getUbicacion,
  crearUbicacion,
  actualizarUbicacion,
} from "../controllers/ubicacionController";

import {
  getMaterias,
  getMateria,
  crearMateria,
  actualizarMateria,
  eliminarMateria,
} from "../controllers/materiaController";
import {
  getParalelos,
  getParalelo,
  crearParalelo,
  actualizarParalelo,
  eliminarParalelo,
} from "../controllers/paraleloController";
import { getDashboard } from "../controllers/dashboardController";
import { getAuditoria } from "../controllers/auditController";
import {
  cambiarPassword,
  solicitarResetPassword,
  obtenerUsuarioPorId,
  resetPassword,
  obtenerUsuarios,
  bloquearUsuario,
  desbloquearUsuario,
} from "../controllers/userController";

import {
  obtenerSesiones,
  cerrarSesion,
} from "../controllers/sessionController";

import { generarAusencias } from "../controllers/absenceController";
import { cerrarMarcados } from "../controllers/closeAttendanceController";
import {
  obtenerJustificaciones,
  crearJustificacion,
  aprobarJustificacion,
  rechazarJustificacion,
} from "../controllers/justificacionController";

import { exportarExcel } from "../controllers/exportController";
import { exportarPdf } from "../controllers/pdfController";
// ─── Auth ───────────────────────────────────────────────────────────────────
export const authRouter = Router();
authRouter.post("/login", login);
authRouter.post("/refresh", refreshToken);
authRouter.post("/logout", autenticar, logout);
authRouter.post(
  "/reset-request",

  solicitarResetPassword,
);

authRouter.post(
  "/reset-password",

  resetPassword,
);

// ─── Marcados ───────────────────────────────────────────────────────────────

export const marcadosRouter = Router();

marcadosRouter.use(autenticar);

// específicas primero
marcadosRouter.get("/docente/:docenteId", getMarcadosDocente);

marcadosRouter.put("/salida/:id", marcarSalida);

// básicas
marcadosRouter.get("/", getMarcados);

marcadosRouter.post("/", registrarMarcado);
marcadosRouter.patch(
  "/:id/confirmar-abandono",
  autorizar(
    UsuarioRol.ADMIN,
    UsuarioRol.DIRECTOR,
  ),
  confirmarAbandono,
);

marcadosRouter.patch(
  "/:id/rechazar-abandono",
  autorizar(
    UsuarioRol.ADMIN,
    UsuarioRol.DIRECTOR,
  ),
  rechazarAbandono,
);
marcadosRouter.get(
  "/abandono",
  autorizar(
    UsuarioRol.ADMIN,
    UsuarioRol.DIRECTOR,
  ),
  obtenerAbandonosPendientes,
);
marcadosRouter.get(
  "/activo/:docenteId",
  obtenerMarcadoActivo,
);
// genérica SIEMPRE al final
marcadosRouter.get("/:id", getMarcado);

marcadosRouter.delete("/:id", autorizar(UsuarioRol.ADMIN), eliminarMarcado);
// ─── Docentes ───────────────────────────────────────────────────────────────
export const docentesRouter = Router();
docentesRouter.use(autenticar);
docentesRouter.get(
  "/",
  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),
  getDocentes,
);
docentesRouter.get("/:id", getDocente);
docentesRouter.post("/", autorizar(UsuarioRol.ADMIN), crearDocente);
docentesRouter.put("/:id", autorizar(UsuarioRol.ADMIN), actualizarDocente);

// ─── Horarios ───────────────────────────────────────────────────────────────
export const horariosRouter = Router();

horariosRouter.use(autenticar);

horariosRouter.get("/", getHorarios);
horariosRouter.get(
  "/docente/:docenteId",
  getHorariosDocente,
);

horariosRouter.get("/paralelo/:id", getHorariosParalelo);
horariosRouter.get("/:id", getHorario);

horariosRouter.post("/", autorizar(UsuarioRol.ADMIN), crearHorario);

horariosRouter.put("/:id", autorizar(UsuarioRol.ADMIN), actualizarHorario);

horariosRouter.delete("/:id", autorizar(UsuarioRol.ADMIN), eliminarHorario);
// ─── Ubicaciones ────────────────────────────────────────────────────────────
export const ubicacionesRouter = Router();
ubicacionesRouter.use(autenticar);
ubicacionesRouter.get("/", getUbicaciones);
ubicacionesRouter.get("/:id", getUbicacion);
ubicacionesRouter.post("/", autorizar(UsuarioRol.ADMIN), crearUbicacion);
ubicacionesRouter.put("/:id", autorizar(UsuarioRol.ADMIN), actualizarUbicacion);

// ─── Materias ────────────────────────────────────────────────────────────────
export const materiasRouter = Router();

materiasRouter.use(autenticar);

materiasRouter.get("/", getMaterias);

materiasRouter.get("/:id", getMateria);

materiasRouter.post("/", autorizar(UsuarioRol.ADMIN), crearMateria);

materiasRouter.put("/:id", autorizar(UsuarioRol.ADMIN), actualizarMateria);

materiasRouter.delete("/:id", autorizar(UsuarioRol.ADMIN), eliminarMateria);
// ─── Paralelos ───────────────────────────────────────────────────────────────
export const paralelosRouter = Router();

paralelosRouter.use(autenticar);

paralelosRouter.get("/", getParalelos);

paralelosRouter.get("/:id", getParalelo);

paralelosRouter.post("/", autorizar(UsuarioRol.ADMIN), crearParalelo);

paralelosRouter.put("/:id", autorizar(UsuarioRol.ADMIN), actualizarParalelo);

paralelosRouter.delete("/:id", autorizar(UsuarioRol.ADMIN), eliminarParalelo);

// ─── Reportes ─────────────────────────────

export const reportesRouter = Router();

reportesRouter.use(autenticar);

reportesRouter.get(
  "/resumen",

  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),

  obtenerResumen,
);

reportesRouter.get(
  "/docente/:id",
  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),
  obtenerReporteDocente,
);
reportesRouter.get(
  "/ranking",

  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),

  obtenerRanking,
);

reportesRouter.get(
  "/excel",

  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),

  exportarExcel,
);
reportesRouter.get(
  "/pdf",

  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),

  exportarPdf,
);

reportesRouter.get(
  "/dashboard-director",

  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),

  obtenerDashboardDirector,
);

// ─── Dashboard ─────────────────────────────
export const dashboardRouter = Router();

dashboardRouter.use(autenticar);

dashboardRouter.get(
  "/",

  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),

  getDashboard,
);

// ─── Auditoria ─────────────────────────────
export const auditoriaRouter = Router();

auditoriaRouter.use(autenticar);

auditoriaRouter.get(
  "/",

  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),

  getAuditoria,
);

// ─── Cambiar Password ─────────────────────────────

export const usuariosRouter = Router();

usuariosRouter.use(autenticar);

usuariosRouter.get(
  "/",
  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),
  obtenerUsuarios,
);

usuariosRouter.patch(
  "/:id/bloquear",
  autorizar(UsuarioRol.ADMIN),
  bloquearUsuario,
);

usuariosRouter.patch(
  "/:id/desbloquear",
  autorizar(UsuarioRol.ADMIN),
  desbloquearUsuario,
);

usuariosRouter.put("/password", cambiarPassword);
///   completar usuarios-----------------------------------
// ─── Sesiones ─────────────────────────────
export const sesionesRouter = Router();

sesionesRouter.use(autenticar);

sesionesRouter.get(
  "/",

  obtenerSesiones,
);

sesionesRouter.delete(
  "/:id",

  cerrarSesion,
);

// ─── Ausencias ─────────────────────────────
export const ausenciasRouter = Router();

ausenciasRouter.use(autenticar);

ausenciasRouter.post(
  "/generar",

  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),

  generarAusencias,
);

// ───  close Marcados ─────────────────────────────
export const cierresRouter = Router();

cierresRouter.use(autenticar);

cierresRouter.post(
  "/ejecutar",

  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),

  cerrarMarcados,
);

// ─── Justificaciones ─────────────────────────────
export const justificacionesRouter = Router();

justificacionesRouter.use(autenticar);

justificacionesRouter.get("/", obtenerJustificaciones);

justificacionesRouter.post("/", crearJustificacion);

justificacionesRouter.patch(
  "/:id/aprobar",

  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),

  aprobarJustificacion,
);

justificacionesRouter.patch(
  "/:id/rechazar",

  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),

  rechazarJustificacion,
);

// ─── Control Permanencia ─────────────────────────────
export const controlPermanenciaRouter = Router();

controlPermanenciaRouter.use(autenticar);

controlPermanenciaRouter.use(
  "/",
  controlPermanenciaRoutes,
);