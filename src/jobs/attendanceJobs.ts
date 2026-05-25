// src/jobs/attendanceJobs.ts

import cron from "node-cron";

import { AbsenceService } from "../services/absenceService";

import { CloseAttendanceService } from "../services/closeAttendanceService";

const absenceService = new AbsenceService();

const closeService = new CloseAttendanceService();

export function iniciarJobs() {
  // 00:00 generar ausencias

  cron.schedule(
    "0 0 * * *",

    async () => {
      console.log("Generando ausencias...");

      const total = await absenceService.generarAusencias();

      console.log(`Ausencias: ${total}`);
    },
  );

  // 23:59 cerrar marcados

  cron.schedule(
    "59 23 * * *",
    // "*/2 * * * *",

    async () => {
      console.log("Cerrando pendientes...");

      const total = await closeService.cerrarPendientes();

      console.log(`Cerrados: ${total}`);
    },
  );

  console.log("Jobs automáticos iniciados");
}
