// src/models/Justificacion.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export enum JustificacionEstado {
  PENDIENTE = "pendiente",
  APROBADA = "aprobada",
  RECHAZADA = "rechazada",
}
export enum JustificacionTipo {
  TARDANZA = "tardanza",
  AUSENCIA = "ausencia",
  ABANDONO = "abandono",
  SALIDA_ANTICIPADA = "salida_anticipada",
}

@Entity("justificaciones")
export class Justificacion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    name: "marcado_id",
    type: "uuid",
  })
  marcadoId!: string;

  @Column({
    name: "docente_id",
    type: "uuid",
  })
  docenteId!: string;

  @Column({
    type: "text",
  })
  motivo!: string;

  @Column({
    type: "varchar",
    length: 500,
    nullable: true,
  })
  archivo!: string | null;

  @Column({
    type: "enum",
    enum: JustificacionEstado,
    default: JustificacionEstado.PENDIENTE,
  })
  estado!: JustificacionEstado;

  @Column({
    type: "enum",
    enum: JustificacionTipo,
  })
  tipo!: JustificacionTipo;

  @Column({
    type: "text",
    nullable: true,
  })
  observaciones!: string | null;

  @Column({
    name: "fecha_revision",
    type: "timestamptz",
    nullable: true,
  })
  fechaRevision!: Date | null;

  @CreateDateColumn({
    name: "fecha_creacion",
  })
  fechaCreacion!: Date;
}
