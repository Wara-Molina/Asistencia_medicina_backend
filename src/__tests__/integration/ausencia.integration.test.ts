// src/__tests__/integration/ausencia.integration.test.ts

import { AppDataSource } from "../../config/database";

import { AsistenciaScheduler } from "../../jobs/asistenciaScheduler";

import { Marcado, AsistenciaEstado } from "../../models/Marcado";

describe("Ausencias automáticas", () => {
  let scheduler: AsistenciaScheduler;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    scheduler = new AsistenciaScheduler();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it("crear ausente automáticamente", async () => {
    await scheduler.marcarAusentes();

    const repo = AppDataSource.getRepository(Marcado);

    const hoy = new Date().toISOString().split("T")[0];

    const ausente = await repo.findOne({
      where: {
        fecha: hoy,

        estadoAsistencia: AsistenciaEstado.AUSENTE,
      },
    });

    console.log(ausente);

    expect(ausente).toBeTruthy();
  });
});
