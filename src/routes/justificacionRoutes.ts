// src/routes/justificacionRoutes.ts

import { Router } from "express";

import {
  obtenerJustificaciones,
  crearJustificacion,
  aprobarJustificacion,
  rechazarJustificacion,
} from "../controllers/justificacionController";

import { autenticar, autorizar } from "../middlewares/auth";

import { UsuarioRol } from "../models/Usuario";

const router = Router();

// listar

router.get("/", autenticar, obtenerJustificaciones);

// crear

router.post("/", autenticar, crearJustificacion);

// aprobar
router.patch(
  "/:id/aprobar",

  autenticar,

  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),

  aprobarJustificacion,
);

router.patch(
  "/:id/rechazar",

  autenticar,

  autorizar(UsuarioRol.ADMIN, UsuarioRol.DIRECTOR),

  rechazarJustificacion,
);
export default router;
