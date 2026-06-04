// src/routes/controlPermanenciaRoutes.ts
import { Router } from "express";
import { ControlPermanenciaController } from "../controllers/controlPermanenciaController";

const router = Router();

const controller =
  new ControlPermanenciaController();

router.post(
  "/",
  controller.registrarControl,
);
router.get(
  "/marcado/:marcadoId",
  controller.obtenerEvidencias,
);

router.get(
  "/:marcadoId",
  controller.obtenerControles,
);
export default router;