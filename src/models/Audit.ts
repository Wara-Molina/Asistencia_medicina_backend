// src/models/Audit.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("auditoria")
export class Audit {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    name: "usuario_id",
    type: "uuid",
    nullable: true,
  })
  usuarioId!: string | null;

  @Column({
    type: "varchar",
    length: 100,
  })
  accion!: string;

  @Column({
    type: "varchar",
    length: 100,
  })
  entidad!: string;

  @Column({
    name: "entidad_id",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  entidadId!: string | null;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  datos!: any;

  @CreateDateColumn({
    name: "fecha_creacion",
  })
  fechaCreacion!: Date;
}
