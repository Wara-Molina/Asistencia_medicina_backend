// src/controllers/closeAttendanceController.ts
import { Request, Response } from "express";

import { CloseAttendanceService } from "../services/closeAttendanceService";

const service = new CloseAttendanceService();

export async function cerrarMarcados(
  _req: Request,
  res: Response,
): Promise<void> {
  const total = await service.cerrarPendientes();

  res.json({
    status: "success",

    data: {
      cerrados: total,
    },

    timestamp: new Date().toISOString(),
  });
}
