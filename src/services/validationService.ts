// src/services/validationService.ts

import { Marcado, MarcadoEstado } from "../models/Marcado";

import { Ubicacion } from "../models/Ubicacion";

import { GeoService } from "./geoService";

export class ValidationService {
  private geoService = new GeoService();

  validarHospital(marcado: Partial<Marcado>, ubicacion: Ubicacion): boolean {
    if (marcado.latitud == null || marcado.longitud == null) {
      return false;
    }

    if (ubicacion.latitud == null || ubicacion.longitud == null) {
      return false;
    }

    const valido = this.geoService.validarRadio(
      Number(marcado.latitud),

      Number(marcado.longitud),

      Number(ubicacion.latitud),

      Number(ubicacion.longitud),

      ubicacion.radioValidacion,
    );

    return valido;
  }

  validarCampus(): MarcadoEstado {
    return MarcadoEstado.VALIDO;
  }

  validarLaboratorio(): MarcadoEstado {
    return MarcadoEstado.VALIDO;
  }

  detectarAbandono(marcado: Marcado, limiteMinutos = 120): MarcadoEstado {
    if (marcado.horaFin) {
      return MarcadoEstado.VALIDO;
    }

    const inicio = new Date(marcado.horaInicio);

    const ahora = new Date();

    const minutos = (ahora.getTime() - inicio.getTime()) / 60000;

    if (minutos > limiteMinutos) {
      return MarcadoEstado.POSIBLE_ABANDONO;
    }

    return MarcadoEstado.VALIDANDO;
  }
}
