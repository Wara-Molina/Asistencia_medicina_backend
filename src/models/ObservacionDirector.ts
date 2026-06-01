import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export enum ObservacionTipo {
  TARDANZA = "tardanza",

  AUSENCIA = "ausencia",

  ABANDONO = "abandono",

  DESEMPENO = "desempeno",

  GENERAL = "general",
}

@Entity("observaciones_director")
export class ObservacionDirector {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    name: "director_id",
    type: "uuid",
  })
  directorId!: string;

  @Column({
    name: "docente_id",
    type: "uuid",
  })
  docenteId!: string;

  @Column({
    type: "enum",
    enum: ObservacionTipo,
  })
  tipo!: ObservacionTipo;

  @Column({
    type: "text",
  })
  descripcion!: string;

  @Column({
    default: false,
  })
  resuelto!: boolean;

  @CreateDateColumn({
    name: "fecha_creacion",
  })
  fechaCreacion!: Date;
}
