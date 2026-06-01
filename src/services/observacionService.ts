import { ObservacionDirector } from "../models/ObservacionDirector";

import { ObservacionRepository } from "../repositories/observacionRepository";

import { AppError } from "../middlewares/errorHandler";

export class ObservacionService {
  private repo = new ObservacionRepository();

  async obtenerTodas() {
    return this.repo.findAll();
  }

  async crear(data: {
    directorId: string;

    docenteId: string;

    tipo: any;

    descripcion: string;
  }) {
    return this.repo.create({
      directorId: data.directorId,

      docenteId: data.docenteId,

      tipo: data.tipo,

      descripcion: data.descripcion,

      resuelto: false,
    });
  }

  async resolver(id: string) {
    const obs = await this.repo.findById(id);

    if (!obs) {
      throw new AppError(
        404,
        "OBSERVACION_NO_EXISTE",
        "Observación inexistente",
      );
    }

    obs.resuelto = true;

    return this.repo.save(obs);
  }
}
