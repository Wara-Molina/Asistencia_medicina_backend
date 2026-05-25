// src/models/Materia.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Paralelo } from "./Paralelo";

export enum MateriaEstado {
  ACTIVO = "activo",
  INACTIVO = "inactivo",
}

@Entity("materias")
export class Materia {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  nombre!: string;

  @Column({ type: "varchar", length: 50, unique: true })
  codigo!: string;

  @Column({ type: "int" })
  creditos!: number;

  @Column({ type: "int" })
  semestre!: number;

  @Column({
    type: "enum",
    enum: MateriaEstado,
    default: MateriaEstado.ACTIVO,
  })
  estado!: MateriaEstado;

  @CreateDateColumn({ name: "fecha_creacion" })
  fechaCreacion!: Date;

  @OneToMany(() => Paralelo, (p) => p.materia)
  paralelos!: Paralelo[];
}
