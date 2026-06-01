// src/services/validationService.ts

import { Marcado, MarcadoEstado } from "../models/Marcado";
import { Ubicacion } from "../models/Ubicacion";

export class ValidationService {
  detectarAbandono(marcado: Marcado, limiteMinutos = 120): MarcadoEstado {
    if (marcado.horaFin) {
      return MarcadoEstado.VALIDO;
    }

    if (!marcado.horaInicio) {
      return MarcadoEstado.RECHAZADO;
    }

    const inicio = new Date(marcado.horaInicio);

    const ahora = new Date();

    const minutos = (ahora.getTime() - inicio.getTime()) / 60000;

    if (minutos > limiteMinutos) {
      return MarcadoEstado.POSIBLE_ABANDONO;
    }

    return MarcadoEstado.VALIDANDO;
  }

  // VALIDAR GPS HOSPITAL
  validarHospital(
    gps: {
      latitud: number;
      longitud: number;
    },
    ubicacion: Ubicacion,
  ): boolean {
    if (
      ubicacion.latitud == null ||
      ubicacion.longitud == null ||
      ubicacion.radioValidacion == null
    ) {
      return false;
    }

    const distancia = this.calcularDistancia(
      gps.latitud,
      gps.longitud,

      Number(ubicacion.latitud),
      Number(ubicacion.longitud),
    );

    return distancia <= ubicacion.radioValidacion;
  }

  private calcularDistancia(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371000;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;

    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
