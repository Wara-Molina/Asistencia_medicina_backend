// src/models/Sesion.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("sesiones")
export class Sesion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    name: "usuario_id",

    type: "uuid",
  })
  usuarioId!: string;

  @Column({
    name: "token",

    type: "text",
  })
  token!: string;

  @Column({
    name: "ip",

    type: "varchar",

    length: 100,

    nullable: true,
  })
  ip!: string | null;

  @Column({
    name: "user_agent",

    type: "text",

    nullable: true,
  })
  userAgent!: string | null;

  @Column({
    name: "activa",

    type: "boolean",

    default: true,
  })
  activa!: boolean;

  @CreateDateColumn({
    name: "fecha_creacion",
  })
  fechaCreacion!: Date;
}
