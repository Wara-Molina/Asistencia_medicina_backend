// src/__tests__/helpers/resetUsuarios.ts

import { AppDataSource } from "../../config/database";
import { Usuario } from "../../models/Usuario";

beforeEach(async () => {
  try {
    // Inicializar conexión si aún no existe
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const repo = AppDataSource.getRepository(Usuario);

    // Desbloquear todos los usuarios
    await repo
      .createQueryBuilder()
      .update(Usuario)
      .set({
        bloqueado: false,

        intentosFallidos: 0,

        activo: true,
      })
      .execute();
  } catch (error) {
    console.error("Error reseteando usuarios:", error);
  }
});

afterAll(async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  } catch (error) {
    console.error("Error cerrando conexión:", error);
  }
});
