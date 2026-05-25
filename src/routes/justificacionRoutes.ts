// src/routes/justificacionRoutes.ts

import { Router } from "express";

import {
  obtenerJustificaciones,
  crearJustificacion,
  aprobarJustificacion,
  rechazarJustificacion,
} from "../controllers/justificacionController";

import { autenticar } from "../middlewares/auth";

const router = Router();

// listar

router.get("/", autenticar, obtenerJustificaciones);

// crear

router.post("/", autenticar, crearJustificacion);

// aprobar

router.patch("/:id/aprobar", autenticar, aprobarJustificacion);

// rechazar

router.patch("/:id/rechazar", autenticar, rechazarJustificacion);

export default router;
