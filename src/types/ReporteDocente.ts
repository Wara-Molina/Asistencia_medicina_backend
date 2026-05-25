// src/types/ReporteDocente.ts
export interface ReporteDocente {
  docenteId: string;

  nombreDocente: string;

  totalMarcados: number;

  validos: number;

  rechazados: number;

  abandonos: number;

  horasTrabajadas: number;

  porcentajeAsistencia: number;
}
