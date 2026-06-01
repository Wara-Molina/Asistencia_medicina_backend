import { Request, Response } from "express";

import { SyncService } from "../services/syncService";

const service = new SyncService();

export async function syncOffline(req: Request, res: Response) {
  const data = await service.sincronizar(req.body.items);

  res.json({
    status: "success",

    data,

    timestamp: new Date().toISOString(),
  });
}
