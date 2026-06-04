// src/services/controlPermanenciaService.ts
import { AppError } from "../middlewares/errorHandler";
import { MarcadoRepository } from "../repositories/marcadoRepository";
import { ControlPermanenciaRepository } from "../repositories/controlPermanenciaRepository";
import { LocationValidationService } from "./locationValidationService";
import {
  AsistenciaEstado,
  MarcadoEstado,
} from "../models/Marcado";
import { ObservacionService } from "./observacionService";
import { UserService } from "./userService";
import { ObservacionTipo } from "../models/ObservacionDirector";

export class ControlPermanenciaService {
  private repository =
    new ControlPermanenciaRepository();

  private marcadoRepository =
    new MarcadoRepository();

  private locationService =
    new LocationValidationService();

  private observacionService =
    new ObservacionService();
  
    private userService =
  new UserService();

  async registrarControl(
    marcadoId: string,
    latitud: number,
    longitud: number,
  ) {
    const marcado =
      await this.marcadoRepository.findById(
        marcadoId,
      );

    if (!marcado) {
      throw new AppError(
        404,
        "MARCADO_NO_ENCONTRADO",
        "Marcado no encontrado",
      );
    }
    if (marcado.horaFin) {
  throw new AppError(
    400,
    "MARCADO_FINALIZADO",
    "La asistencia ya fue cerrada",
  );
}

if (
  marcado.estado ===
  MarcadoEstado.POSIBLE_ABANDONO
) {
  throw new AppError(
    400,
    "ABANDONO_DETECTADO",
    "El marcado ya fue marcado como abandono",
  );
}

    if (!marcado.ubicacionId) {
      throw new AppError(
        400,
        "UBICACION_REQUERIDA",
        "El marcado no tiene ubicación asignada",
      );
    }
      const ultimoControl =
  await this.repository.obtenerUltimoControl(
    marcadoId,
  );
  if (ultimoControl) {
  const diferencia =
    Date.now() -
    ultimoControl.fechaControl.getTime();

  const minutos =
    diferencia / 1000 / 60;

  if (minutos < 5) {
    throw new AppError(
      400,
      "CONTROL_RECIENTE",
      "Ya existe un control registrado en los últimos 5 minutos",
    );
  }
}
    const distancia =
      await this.locationService.distanciaMetros(
        marcado.ubicacionId,
        latitud,
        longitud,
      );

    const dentroPerimetro =
      await this.locationService.validarDistancia(
        marcado.ubicacionId,
        latitud,
        longitud,
      );

    const control =
      await this.repository.create({
        marcadoId,
        latitud,
        longitud,
        distanciaMetros: distancia,
        dentroPerimetro,
      });

      const ultimos =
  await this.repository.obtenerUltimosControles(
    marcadoId,
    5,
  );
const abandono =
  ultimos.length === 5 &&
  ultimos.every(
    c => !c.dentroPerimetro,
  );
if (abandono) {
 await this.marcadoRepository.update(
  marcadoId,
  {
    estado:
      MarcadoEstado.POSIBLE_ABANDONO,

    estadoAsistencia:
      AsistenciaEstado.ABANDONO,

    fechaAbandono:
      new Date(),
  },
);

  const director =
    await this.userService.obtenerDirector();

  if (director) {
    await this.observacionService.crear({
      directorId: director.id,

      docenteId:
        marcado.docenteId,

      tipo:
        ObservacionTipo.ABANDONO,

      descripcion:
        `Posible abandono detectado automáticamente.
         Distancia: ${distancia.toFixed(2)} metros.
         Marcado: ${marcado.id}`,
    });
  }
}

    return control;
  }
  async obtenerEvidencias(
  marcadoId: string,
) {
  const marcado =
    await this.marcadoRepository.findById(
      marcadoId,
    );

  if (!marcado) {
    throw new AppError(
      404,
      "MARCADO_NO_ENCONTRADO",
      "Marcado no encontrado",
    );
  }

  return this.repository.findByMarcadoId(
    marcadoId,
  );
}
async obtenerControles(
  marcadoId: string,
) {
  return this.repository.findByMarcado(
    marcadoId,
  );
}

}