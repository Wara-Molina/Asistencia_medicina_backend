import { Request, Response } from "express";

import { ObservacionService } from "../services/observacionService";

const service = new ObservacionService();

export async function obtenerObservaciones(_req: Request, res: Response) {
  const data = await service.obtenerTodas();

  res.json({
    status: "success",

    data,

    timestamp: new Date().toISOString(),
  });
}

export async function crearObservacion(req: Request, res: Response) {
  const data = await service.crear(req.body);

  res.status(201).json({
    status: "success",

    data,

    timestamp: new Date().toISOString(),
  });
}

export async function resolverObservacion(req: Request, res: Response) {
  const data = await service.resolver(req.params.id);

  res.json({
    status: "success",

    data,

    timestamp: new Date().toISOString(),
  });
}
