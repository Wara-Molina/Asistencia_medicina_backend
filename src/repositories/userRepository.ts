// src/repositories/userRepository.ts

import { AppDataSource } from "../config/database";

import { Usuario, UsuarioRol } from "../models/Usuario";

export class UserRepository {
  private repo = AppDataSource.getRepository(Usuario);

  async findById(id: string): Promise<Usuario | null> {
    return this.repo.findOneBy({
      id,
    });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.repo.findOneBy({
      email,
    });
  }

  async update(
    id: string,

    data: Partial<Usuario>,
  ): Promise<Usuario | null> {
    await this.repo.update(id, data);

    return this.findById(id);
  }

  async incrementarIntentos(id: string): Promise<void> {
    await this.repo.increment(
      {
        id,
      },

      "intentosFallidos",

      1,
    );
  }

  async resetIntentos(id: string): Promise<void> {
    await this.repo.update(
      id,

      {
        intentosFallidos: 0,
      },
    );
  }

  async bloquear(id: string): Promise<void> {
    await this.repo.update(
      id,

      {
        bloqueado: true,
      },
    );
  }

  async findByResetToken(token: string): Promise<Usuario | null> {
    return this.repo.findOneBy({
      resetToken: token,
    });
  }
  async findAll(): Promise<Usuario[]> {
    return this.repo.find({
      select: {
        id: true,
        email: true,
        rol: true,
        docenteId: true,
        nombreCompleto: true,
        activo: true,
        debeCambiarPassword: true,
        primerLogin: true,
        intentosFallidos: true,
        bloqueado: true,
        ultimoAcceso: true,
        fechaCreacion: true,
        fechaActualizacion: true,
      },

      order: {
        fechaCreacion: "DESC",
      },
    });
  }

  async desbloquear(id: string): Promise<void> {
    await this.repo.update(id, {
      bloqueado: false,
      intentosFallidos: 0,
    });
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const usuario = this.repo.create(data);

    return this.repo.save(usuario);
  }

  async findDirector(): Promise<Usuario | null> {
  return this.repo.findOne({
    where: {
      rol: UsuarioRol.DIRECTOR,
      activo: true,
    },
  });
}


}
