// src/services/locationValidationService.ts
import { AppDataSource } from "../config/database";

export class LocationValidationService {
  async validarDistancia(
    ubicacionId: string,

    latitud: number,

    longitud: number,
  ): Promise<boolean> {
    const result = await AppDataSource.query(
      `
        SELECT
          ST_DWithin(
            ST_MakePoint(
              longitud,
              latitud
            )::geography,

            ST_MakePoint(
              $2,
              $1
            )::geography,

            radio_validacion
          ) as valido

        FROM ubicaciones

        WHERE id = $3
        `,
      [latitud, longitud, ubicacionId],
    );

    return result?.[0]?.valido === true;
  }

  async distanciaMetros(
    ubicacionId: string,

    latitud: number,

    longitud: number,
  ): Promise<number> {
    const result = await AppDataSource.query(
      `
        SELECT
          ST_Distance(
            ST_MakePoint(
              longitud,
              latitud
            )::geography,

            ST_MakePoint(
              $2,
              $1
            )::geography
          ) as distancia

        FROM ubicaciones

        WHERE id = $3
        `,
      [latitud, longitud, ubicacionId],
    );

    return Number(result?.[0]?.distancia ?? 0);
  }
}
