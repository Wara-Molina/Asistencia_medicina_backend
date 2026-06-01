// src/services/closeAttendanceService.ts

import { AppDataSource } from "../config/database";

import { Marcado, MarcadoEstado } from "../models/Marcado";
import { IsNull } from "typeorm";

export class CloseAttendanceService {
  private repo = AppDataSource.getRepository(Marcado);

  async cerrarPendientes(): Promise<number> {
    const abiertos = await this.repo.find({
      where: {
        horaFin: IsNull(),
      },
    });

    let cerrados = 0;

    for (const marcado of abiertos) {
      marcado.horaFin = new Date();

      marcado.estado = MarcadoEstado.POSIBLE_ABANDONO;

      if (!marcado.horaInicio) {
        continue;
      }

      const inicio = new Date(marcado.horaInicio);

      const fin = new Date(marcado.horaFin);

      marcado.minutosTrabajados = Math.floor(
        (fin.getTime() - inicio.getTime()) / 60000,
      );

      await this.repo.save(marcado);

      cerrados++;
    }

    return cerrados;
  }
}
