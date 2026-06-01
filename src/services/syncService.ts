import { AppDataSource } from "../config/database";

import { Marcado } from "../models/Marcado";

export class SyncService {
  private repo = AppDataSource.getRepository(Marcado);

  async sincronizar(items: any[]) {
    const resultado = [];

    for (const item of items) {
      const existe = await this.repo.findOne({
        where: {
          offlineId: item.offlineId,
        },
      });

      if (existe) {
        resultado.push({
          offlineId: item.offlineId,

          estado: "duplicado",
        });

        continue;
      }

      const nuevo = this.repo.create({
        docenteId: item.docenteId,

        horarioId: item.horarioId,

        fecha: item.fecha,

        horaInicio: item.horaInicio,

        tipoMarcado: item.tipoMarcado,

        ubicacionId: item.ubicacionId,

        latitud: item.latitud,

        longitud: item.longitud,

        sincronizadoOffline: true,

        offlineId: item.offlineId,

        fechaDispositivo: item.fechaDispositivo,
      });

      await this.repo.save(nuevo);

      resultado.push({
        offlineId: item.offlineId,

        estado: "sincronizado",
      });
    }

    return resultado;
  }
}
