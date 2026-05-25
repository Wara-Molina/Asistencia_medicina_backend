// src/controllers/dashboardController.ts
import { Request, Response } from "express";

import { DashboardService } from "../services/dashboardService";

const dashboardService = new DashboardService();

export async function getDashboard(
  _req: Request,
  res: Response,
): Promise<void> {
  const data = await dashboardService.obtenerDashboard();

  res.json({
    status: "success",

    data,

    timestamp: new Date().toISOString(),
  });
}
