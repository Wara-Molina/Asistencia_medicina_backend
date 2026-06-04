// src/models/ControlPermanencia.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from "typeorm";

import { Marcado } from "./Marcado";

@Index("IDX_CONTROL_MARCADO", ["marcadoId"])
@Index("IDX_CONTROL_FECHA", ["fechaControl"])
@Index("IDX_CONTROL_MARCADO_FECHA", [
  "marcadoId",
  "fechaControl",
])
@Entity("controles_permanencia")
export class ControlPermanencia {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    name: "marcado_id",
    type: "uuid",
  })
  marcadoId!: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 8,
  })
  latitud!: number;

  @Column({
    type: "decimal",
    precision: 11,
    scale: 8,
  })
  longitud!: number;

  @Column({
    name: "distancia_metros",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  distanciaMetros!: number;

  @Column({
    name: "dentro_perimetro",
    type: "boolean",
  })
  dentroPerimetro!: boolean;

  @CreateDateColumn({
    name: "fecha_control",
  })
  fechaControl!: Date;

  @ManyToOne(() => Marcado, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "marcado_id",
  })
  marcado!: Marcado;
}
