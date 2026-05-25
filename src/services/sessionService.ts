// src/services/sessionService.ts
import { SessionRepository } from "../repositories/sessionRepository";

export class SessionService {
  private repository = new SessionRepository();

  async registrarLogin(
    usuarioId: string,

    token: string,

    ip?: string,

    userAgent?: string,
  ) {
    return this.repository.crear({
      usuarioId,

      token,

      ip: ip ?? null,

      userAgent: userAgent ?? null,

      activa: true,
    });
  }

  async obtenerSesiones(usuarioId: string) {
    return this.repository.obtenerActivas(usuarioId);
  }

  async cerrarSesion(sesionId: string) {
    await this.repository.cerrar(sesionId);
  }

  async cerrarTodas(usuarioId: string) {
    await this.repository.cerrarTodas(usuarioId);
  }
}
