// src/services/geoService.ts

export class GeoService {
  private readonly RADIO_TIERRA = 6371000;

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  calcularDistancia(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    /* validar coordenadas */

    this.validarCoordenadas(lat1, lon1);

    this.validarCoordenadas(lat2, lon2);

    /* mismo punto */

    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    }

    const dLat = this.toRad(lat2 - lat1);

    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = this.RADIO_TIERRA * c;

    /* precisión metros */

    return Number(distancia.toFixed(2));
  }

  validarRadio(
    docenteLat: number,
    docenteLon: number,

    ubicacionLat: number,
    ubicacionLon: number,

    radio: number,
  ): boolean {
    if (radio <= 0) {
      return false;
    }

    const distancia = this.calcularDistancia(
      docenteLat,
      docenteLon,

      ubicacionLat,
      ubicacionLon,
    );

    return distancia <= radio;
  }

  private validarCoordenadas(lat: number, lon: number): void {
    if (lat < -90 || lat > 90) {
      throw new Error("Latitud inválida");
    }

    if (lon < -180 || lon > 180) {
      throw new Error("Longitud inválida");
    }
  }
}
