// src/controllers/absenceController.ts
import { Request, Response } from "express";

import { AbsenceService } from "../services/absenceService";

const service = new AbsenceService();

export async function generarAusencias(
  _req: Request,
  res: Response,
): Promise<void> {
  const total = await service.generarAusencias();

  res.json({
    status: "success",

    data: {
      ausencias: total,
    },

    timestamp: new Date().toISOString(),
  });
}
