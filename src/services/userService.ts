// src/services/userService.ts

import { AppError } from "../middlewares/errorHandler";

import { UserRepository } from "../repositories/userRepository";

import { hashPassword } from "./authService";
import crypto from "crypto";
export class UserService {
  private repository = new UserRepository();

  async cambiarPassword(
    usuarioId: string,

    nuevaPassword: string,
  ): Promise<void> {
    const usuario = await this.repository.findById(usuarioId);

    if (!usuario) {
      throw new AppError(
        404,

        "USUARIO_NO_ENCONTRADO",

        "Usuario no encontrado",
      );
    }

    const passwordHash = await hashPassword(nuevaPassword);

    await this.repository.update(
      usuarioId,

      {
        password: passwordHash,

        primerLogin: false,

        debeCambiarPassword: false,

        intentosFallidos: 0,
      },
    );
  }

  async solicitarReset(email: string): Promise<string> {
    const usuario = await this.repository.findByEmail(email);

    if (!usuario) {
      throw new AppError(404, "USUARIO_NO_ENCONTRADO", "Usuario no encontrado");
    }

    const token = crypto.randomUUID();

    const expira = new Date(Date.now() + 15 * 60 * 1000);

    await this.repository.update(
      usuario.id,

      {
        resetToken: token,

        resetExpira: expira,
      },
    );

    return token;
  }

  async resetPassword(
    token: string,

    nuevaPassword: string,
  ): Promise<void> {
    const usuario = await this.repository.findByResetToken(token);

    if (!usuario) {
      throw new AppError(404, "TOKEN_INVALIDO", "Token inválido");
    }

    if (!usuario.resetExpira || usuario.resetExpira < new Date()) {
      throw new AppError(400, "TOKEN_EXPIRADO", "Token expirado");
    }

    const hash = await hashPassword(nuevaPassword);

    await this.repository.update(
      usuario.id,

      {
        password: hash,

        resetToken: null,

        resetExpira: null,

        primerLogin: false,

        debeCambiarPassword: false,
      },
    );
  }

  async obtenerTodos() {
    return this.repository.findAll();
  }

  async bloquearUsuario(id: string) {
    const usuario = await this.repository.findById(id);

    if (!usuario) {
      throw new AppError(404, "USUARIO_NO_ENCONTRADO", "Usuario no encontrado");
    }

    await this.repository.bloquear(id);
  }

  async desbloquearUsuario(id: string) {
    const usuario = await this.repository.findById(id);

    if (!usuario) {
      throw new AppError(404, "USUARIO_NO_ENCONTRADO", "Usuario no encontrado");
    }

    await this.repository.desbloquear(id);
  }
  async obtenerPorId(id: string) {
    const usuario = await this.repository.findById(id);

    if (!usuario) {
      throw new AppError(404, "USUARIO_NO_ENCONTRADO", "Usuario no encontrado");
    }

    return usuario;
  }
  async obtenerDirector() {
  return this.repository.findDirector();
}



}
