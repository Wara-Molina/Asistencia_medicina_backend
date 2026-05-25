// src/controllers/ubicacionController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Ubicacion, UbicacionEstado } from "../models/Ubicacion";
import { AppError } from "../middlewares/errorHandler";
import { ubicacionSchema } from "../validations/schemas";
import {
  getCache,
  setCache,
  invalidateCache,
  CacheKeys,
  CACHE_TTL,
} from "../config/cache";

const repo = () => AppDataSource.getRepository(Ubicacion);

export async function getUbicaciones(
  _req: Request,
  res: Response,
): Promise<void> {
  const key = CacheKeys.ubicaciones();
  const cached = await getCache(key);
  if (cached) {
    res.json({
      status: "success",
      data: cached,
      fromCache: true,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const data = await repo().find({
    where: { estado: UbicacionEstado.ACTIVA },
    order: { tipo: "ASC", nombre: "ASC" },
  });
  await setCache(key, data, CACHE_TTL.UBICACIONES);
  res.json({ status: "success", data, timestamp: new Date().toISOString() });
}

export async function getUbicacion(req: Request, res: Response): Promise<void> {
  const u = await repo().findOneBy({ id: req.params.id });
  if (!u) throw new AppError(404, "NOT_FOUND", "Ubicación no encontrada.");
  res.json({ status: "success", data: u, timestamp: new Date().toISOString() });
}

export async function crearUbicacion(
  req: Request,
  res: Response,
): Promise<void> {
  const body = ubicacionSchema.parse(req.body);
  const saved = await repo().save(
    repo().create({
      ...body,

      tipo: body.tipo as any,
    }),
  );
  await invalidateCache(CacheKeys.ubicaciones());
  res.status(201).json({
    status: "success",
    data: saved,
    timestamp: new Date().toISOString(),
  });
}

export async function actualizarUbicacion(
  req: Request,
  res: Response,
): Promise<void> {
  const { id } = req.params;
  const body = ubicacionSchema.partial().parse(req.body);
  const u = await repo().findOneBy({ id });
  if (!u) throw new AppError(404, "NOT_FOUND", "Ubicación no encontrada.");
  await repo().update(
    id,

    {
      ...body,

      tipo: body.tipo as any,
    },
  );
  await invalidateCache(CacheKeys.ubicaciones());
  res.json({
    status: "success",
    data: await repo().findOneBy({ id }),
    timestamp: new Date().toISOString(),
  });
}
