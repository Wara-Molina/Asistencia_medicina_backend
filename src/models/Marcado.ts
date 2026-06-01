// src/models/Marcado.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from "typeorm";
import { Docente } from "./Docente";
import { Horario } from "./Horario";
import { Ubicacion } from "./Ubicacion";

export enum TipoMarcado {
  BIOMETRICO = "biometrico",
  APP_CAMPUS = "app_campus",
  APP_LABORATORIO = "app_laboratorio",
  APP_HOSPITAL = "app_hospital",
  AUTOMATICO = "automatico",
}

export enum MarcadoEstado {
  VALIDO = "valido",
  INVALIDO = "invalido",
  VALIDANDO = "validando",
  RECHAZADO = "rechazado",

  POSIBLE_ABANDONO = "posible_abandono",
}
export enum AsistenciaEstado {
  PRESENTE = "presente",

  TARDANZA = "tardanza",

  AUSENTE = "ausente",

  ABANDONO = "abandono",

  SALIDA_ANTICIPADA = "salida_anticipada",
}

@Index("IDX_MARCADO_DOCENTE_FECHA", ["docenteId", "fecha"])
@Index("IDX_MARCADO_ESTADO", ["estado"])
@Index("IDX_MARCADO_ASISTENCIA", ["estadoAsistencia"])
@Entity("marcados")
export class Marcado {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "docente_id", type: "uuid" })
  docenteId!: string;

  @Column({ name: "horario_id", type: "uuid", nullable: true })
  horarioId!: string | null;

  @Column({ type: "date" })
  fecha!: string;

  @Column({
    name: "hora_inicio",
    type: "timestamptz",

    nullable: true,
  })
  horaInicio!: Date | null;

  @Column({ name: "hora_fin", type: "timestamptz", nullable: true })
  horaFin!: Date | null;

  @Column({ name: "tipo_marcado", type: "enum", enum: TipoMarcado })
  tipoMarcado!: TipoMarcado;

  @Column({ name: "ubicacion_id", type: "uuid", nullable: true })
  ubicacionId!: string | null;

  // GPS — solo hospitales
  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  latitud!: number | null;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  longitud!: number | null;

  @Column({
    type: "enum",
    enum: MarcadoEstado,
    default: MarcadoEstado.VALIDANDO,
  })
  estado!: MarcadoEstado;

  @Column({ type: "text", nullable: true })
  notas!: string | null;

  @Column({ name: "sincronizado_offline", type: "boolean", default: false })
  sincronizadoOffline!: boolean;
  @Column({
    name: "offline_id",
    type: "varchar",
    length: 100,
    nullable: true,
  })
  offlineId!: string | null;

  @Column({
    name: "fecha_dispositivo",
    type: "timestamptz",
    nullable: true,
  })
  fechaDispositivo!: Date | null;

  @Column({
    name: "justificado",
    type: "boolean",
    default: false,
  })
  justificado!: boolean;

  @CreateDateColumn({ name: "fecha_creacion" })
  fechaCreacion!: Date;

  @ManyToOne(() => Docente, (d) => d.marcados)
  @JoinColumn({ name: "docente_id" })
  docente!: Docente;

  @ManyToOne(() => Horario, (h) => h.marcados, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({
    name: "horario_id",
  })
  horario!: Horario | null;

  @ManyToOne(() => Ubicacion, (u) => u.marcados, { nullable: true })
  @JoinColumn({ name: "ubicacion_id" })
  ubicacion!: Ubicacion | null;

  @Column({
    name: "estado_asistencia",

    type: "enum",

    enum: AsistenciaEstado,

    nullable: true,
  })
  estadoAsistencia!: AsistenciaEstado | null;

  @Column({
    name: "minutos_retraso",
    type: "integer",
    default: 0,
  })
  minutosRetraso!: number;

  @Column({
    name: "minutos_trabajados",
    type: "integer",
    default: 0,
  })
  minutosTrabajados!: number;
}
