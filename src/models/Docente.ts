// src/models/docente.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Paralelo } from "./Paralelo";
import { Marcado } from "./Marcado";

export enum DocenteEstado {
  ACTIVO = "activo",
  INACTIVO = "inactivo",
}

@Entity("docentes")
export class Docente {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "nombre_completo", type: "varchar", length: 255 })
  nombreCompleto!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 20, unique: true })
  cedula!: string;

  @Column({ type: "varchar", length: 100 })
  departamento!: string;

  @Column({
    type: "enum",
    enum: DocenteEstado,
    default: DocenteEstado.ACTIVO,
  })
  estado!: DocenteEstado;

  @CreateDateColumn({ name: "fecha_creacion" })
  fechaCreacion!: Date;

  @OneToMany(() => Paralelo, (p) => p.docente)
  paralelos!: Paralelo[];

  @OneToMany(() => Marcado, (m) => m.docente)
  marcados!: Marcado[];
}
