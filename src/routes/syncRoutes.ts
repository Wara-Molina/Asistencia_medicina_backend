// src/routes/syncRoutes.ts
import { Router } from "express";

import { autenticar } from "../middlewares/auth";

import { syncOffline } from "../controllers/syncController";

const router = Router();

router.post(
  "/",

  autenticar,

  syncOffline,
);

export default router;
