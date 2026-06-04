// src/routes/observacionRoutes.ts
import { Router } from "express";

import { autenticar, autorizar } from "../middlewares/auth";

import {
  obtenerObservaciones,
  crearObservacion,
  resolverObservacion,
} from "../controllers/observacionController";

import { UsuarioRol } from "../models/Usuario";

const router = Router();

router.use(autenticar);

router.get(
  "/",

  autorizar(UsuarioRol.DIRECTOR,
    UsuarioRol.ADMIN
  ),

  obtenerObservaciones,
);

router.post(
  "/",

  autorizar(UsuarioRol.DIRECTOR, UsuarioRol.ADMIN),

  crearObservacion,
);

router.patch(
  "/:id/resolver",

  autorizar(UsuarioRol.DIRECTOR, UsuarioRol.ADMIN),

  resolverObservacion,
);

export default router;
