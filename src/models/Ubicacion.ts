// src/models/Ubicacion.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Horario } from "./Horario";
import { Marcado } from "./Marcado";

export enum UbicacionTipo {
  AULA = "aula",
  LABORATORIO = "laboratorio",
  HOSPITAL = "hospital",
}

export enum UbicacionEstado {
  ACTIVA = "activa",
  INACTIVA = "inactiva",
}

@Entity("ubicaciones")
export class Ubicacion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  nombre!: string;

  @Column({ type: "enum", enum: UbicacionTipo })
  tipo!: UbicacionTipo;

  @Column({
    name: "edificio_campus",
    type: "varchar",
    length: 100,
    nullable: true,
  })
  edificioCampus!: string | null;

  @Column({ type: "int", nullable: true })
  capacidad!: number | null;

  // GPS — solo hospitales
  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  latitud!: number | null;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  longitud!: number | null;

  @Column({ name: "radio_validacion", type: "int", default: 300 })
  radioValidacion!: number;

  @Column({
    type: "enum",
    enum: UbicacionEstado,
    default: UbicacionEstado.ACTIVA,
  })
  estado!: UbicacionEstado;

  @CreateDateColumn({ name: "fecha_creacion" })
  fechaCreacion!: Date;

  @OneToMany(() => Horario, (h) => h.ubicacion)
  horarios!: Horario[];

  @OneToMany(() => Marcado, (m) => m.ubicacion)
  marcados!: Marcado[];
}
