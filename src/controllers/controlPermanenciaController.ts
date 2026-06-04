// src/controllers/controlPermanenciaController.ts
import { Request, Response, NextFunction } from "express";
import { ControlPermanenciaService } from "../services/controlPermanenciaService";
import { controlPermanenciaSchema }
  from "../validations/schemas";

export class ControlPermanenciaController {
  private service =
    new ControlPermanenciaService();

  registrarControl = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
     const body =
  controlPermanenciaSchema.parse(
    req.body,
  );

const {
  marcadoId,
  latitud,
  longitud,
} = body;

      const control =
        await this.service.registrarControl(
          marcadoId,
          latitud,
          longitud,
        );

      res.status(201).json({
        success: true,
        data: control,
      });
    } catch (error) {
      next(error);
    }
  };

  obtenerEvidencias = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { marcadoId } = req.params;

    const evidencias =
      await this.service.obtenerEvidencias(
        marcadoId,
      );

    res.json({
      success: true,
      data: evidencias,
    });
  } catch (error) {
    next(error);
  }
};
obtenerControles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const controles =
      await this.service.obtenerControles(
        req.params.marcadoId,
      );

    res.json({
      success: true,
      data: controles,
    });
  } catch (error) {
    next(error);
  }
};
}