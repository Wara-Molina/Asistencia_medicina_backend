// src/models/Paralelo.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Materia } from "./Materia";
import { Docente } from "./Docente";
import { Horario } from "./Horario";

@Entity("paralelos")
export class Paralelo {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "materia_id", type: "uuid" })
  materiaId!: string;

  @Column({ type: "varchar", length: 5 })
  numero!: string; // 'A', 'B', 'C'

  @Column({ name: "docente_id", type: "uuid" })
  docenteId!: string;

  @Column({ type: "int", nullable: true })
  capacidad!: number;

  @Column({ name: "semestre_academico", type: "varchar", length: 10 })
  semestreAcademico!: string; // '2024-1'

  @ManyToOne(() => Materia, (m) => m.paralelos)
  @JoinColumn({ name: "materia_id" })
  materia!: Materia;

  @ManyToOne(() => Docente, (d) => d.paralelos)
  @JoinColumn({ name: "docente_id" })
  docente!: Docente;

  @OneToMany(() => Horario, (h) => h.paralelo)
  horarios!: Horario[];
}
