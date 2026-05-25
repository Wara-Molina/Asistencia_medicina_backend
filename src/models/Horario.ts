// src/models/Horario.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Paralelo } from "./Paralelo";
import { Ubicacion } from "./Ubicacion";
import { Marcado } from "./Marcado";
import { Index } from "typeorm";

export enum TipoActividad {
  CLASE = "clase",
  LABORATORIO = "laboratorio",
  ROTE = "rote",
}

export enum HorarioEstado {
  ACTIVO = "activo",
  SUSPENDIDO = "suspendido",
}

@Index("IDX_HORARIO_PARALELO_DIA", ["paraleloId", "diaSemana"])
@Entity("horarios")
export class Horario {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "paralelo_id", type: "uuid" })
  paraleloId!: string;

  // 0=Lunes … 6=Domingo
  @Column({ name: "dia_semana", type: "int" })
  diaSemana!: number;

  @Column({ name: "hora_inicio", type: "time" })
  horaInicio!: string;

  @Column({ name: "hora_fin", type: "time" })
  horaFin!: string;

  @Column({ name: "ubicacion_id", type: "uuid" })
  ubicacionId!: string;

  @Column({ name: "tipo_actividad", type: "enum", enum: TipoActividad })
  tipoActividad!: TipoActividad;

  @Column({
    type: "enum",
    enum: HorarioEstado,
    default: HorarioEstado.ACTIVO,
  })
  estado!: HorarioEstado;

  @ManyToOne(() => Paralelo, (p) => p.horarios)
  @JoinColumn({ name: "paralelo_id" })
  paralelo!: Paralelo;

  @ManyToOne(() => Ubicacion, (u) => u.horarios)
  @JoinColumn({ name: "ubicacion_id" })
  ubicacion!: Ubicacion;

  @OneToMany(() => Marcado, (m) => m.horario)
  marcados!: Marcado[];
}
