// src/models/Usuario.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum UsuarioRol {
  ADMIN = "admin",
  DOCENTE = "docente",
  DIRECTOR = "director",
}

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string; // hash bcrypt

  @Column({ type: "enum", enum: UsuarioRol, default: UsuarioRol.DOCENTE })
  rol!: UsuarioRol;

  @Column({ name: "docente_id", type: "uuid", nullable: true })
  docenteId!: string | null;

  @Column({ name: "nombre_completo", type: "varchar", length: 255 })
  nombreCompleto!: string;

  @Column({ type: "boolean", default: true })
  activo!: boolean;
  @Column({
    name: "debe_cambiar_password",
    type: "boolean",
    default: true,
  })
  debeCambiarPassword!: boolean;

  @Column({
    name: "primer_login",
    type: "boolean",
    default: true,
  })
  primerLogin!: boolean;

  @Column({
    name: "intentos_fallidos",
    type: "int",
    default: 0,
  })
  intentosFallidos!: number;

  @Column({
    name: "bloqueado",
    type: "boolean",
    default: false,
  })
  bloqueado!: boolean;
  @Column({
    name: "fecha_bloqueo",
    type: "timestamptz",
    nullable: true,
  })
  fechaBloqueo!: Date | null;

  @Column({
    name: "reset_token",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  resetToken!: string | null;

  @Column({
    name: "reset_expira",
    type: "timestamptz",
    nullable: true,
  })
  resetExpira!: Date | null;

  @Column({ name: "ultimo_acceso", type: "timestamptz", nullable: true })
  ultimoAcceso!: Date | null;

  @CreateDateColumn({ name: "fecha_creacion" })
  fechaCreacion!: Date;

  @UpdateDateColumn({ name: "fecha_actualizacion" })
  fechaActualizacion!: Date;
}
