// src/repositories/marcadoRepository.ts
import { AppDataSource } from "../config/database";
import {
  Marcado,
  MarcadoEstado,
  AsistenciaEstado,
} from "../models/Marcado";
import { IsNull } from "typeorm";

export class MarcadoRepository {
  private repository = AppDataSource.getRepository(Marcado);

  async findAll(): Promise<Marcado[]> {
    return this.repository.find({
      relations: {
        docente: true,
        horario: true,
        ubicacion: true,
      },

      order: {
        fechaCreacion: "DESC",
      },
    });
  }

  async findById(id: string): Promise<Marcado | null> {
    return this.repository.findOne({
      where: { id },

      relations: {
        docente: true,
        horario: true,
        ubicacion: true,
      },
    });
  }

  async findByDocente(docenteId: string): Promise<Marcado[]> {
    return this.repository.find({
      where: {
        docenteId,
      },

      relations: {
        horario: true,
        ubicacion: true,
      },

      order: {
        fechaCreacion: "DESC",
      },
    });
  }
  async findByDocenteHorarioFecha(
    docenteId: string,
    horarioId: string,
    fecha: string,
  ): Promise<Marcado | null> {
    return this.repository.findOne({
      where: {
        docenteId,
        horarioId,
        fecha,
      },
    });
  }

  async create(data: Partial<Marcado>): Promise<Marcado> {
    const marcado = this.repository.create(data);

    return this.repository.save(marcado);
  }

  async save(marcado: Marcado): Promise<Marcado> {
    return this.repository.save(marcado);
  }
  async update(id: string, data: Partial<Marcado>): Promise<Marcado | null> {
    const marcado = await this.findById(id);

    if (!marcado) {
      return null;
    }

    Object.assign(marcado, data);

    return this.repository.save(marcado);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);

    return (result.affected ?? 0) > 0;
  }
async findMarcadoActivo(
  docenteId: string,
): Promise<Marcado | null> {
  return this.repository.findOne({
    where: {
      docenteId,
      horaFin: IsNull(),
    },
    relations: [
      "horario",
      "ubicacion",
    ],
  });
}

async confirmarAbandono(
  id: string,
): Promise<Marcado | null> {
  return this.update(id, {
    abandonoConfirmado: true,
  });
}
async rechazarAbandono(
  id: string,
): Promise<Marcado | null> {
  return this.update(id, {
    abandonoConfirmado: false,

    estado: MarcadoEstado.VALIDO,

    estadoAsistencia:
      AsistenciaEstado.PRESENTE,
  });
}

async obtenerAbandonosPendientes() {
  return this.repository.find({
    where: {
      estado:
        MarcadoEstado.POSIBLE_ABANDONO,

      abandonoConfirmado: false,
    },

    relations: {
      docente: true,
      horario: true,
      ubicacion: true,
    },

    order: {
      fechaCreacion: "DESC",
    },
  });
}

}
