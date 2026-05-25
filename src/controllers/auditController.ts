// src/controllers/auditController.ts
import { Request, Response } from "express";

import { AuditService } from "../services/auditService";

const auditService = new AuditService();

export async function getAuditoria(
  _req: Request,
  res: Response,
): Promise<void> {
  const data = await auditService.obtenerTodos();

  res.json({
    status: "success",

    data,

    timestamp: new Date().toISOString(),
  });
}
