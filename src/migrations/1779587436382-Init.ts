// src/migrations/1779587436382-Init.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1779587436382 implements MigrationInterface {
  name = "Init1779587436382";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."materias_estado_enum" AS ENUM('activo', 'inactivo')`,
    );
    await queryRunner.query(
      `CREATE TABLE "materias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(255) NOT NULL, "codigo" character varying(50) NOT NULL, "creditos" integer NOT NULL, "semestre" integer NOT NULL, "estado" "public"."materias_estado_enum" NOT NULL DEFAULT 'activo', "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6ccd8678dae2e2def234be7ab35" UNIQUE ("codigo"), CONSTRAINT "PK_3715a51974d6fcefbc528059df6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."marcados_tipo_marcado_enum" AS ENUM('biometrico', 'app_campus', 'app_laboratorio', 'app_hospital')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."marcados_estado_enum" AS ENUM('valido', 'invalido', 'validando', 'rechazado', 'posible_abandono')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."marcados_estado_asistencia_enum" AS ENUM('presente', 'tardanza', 'ausente', 'abandono', 'salida_anticipada')`,
    );
    await queryRunner.query(
      `CREATE TABLE "marcados" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "docente_id" uuid NOT NULL, "horario_id" uuid, "fecha" date NOT NULL, "hora_inicio" TIMESTAMP WITH TIME ZONE NOT NULL, "hora_fin" TIMESTAMP WITH TIME ZONE, "tipo_marcado" "public"."marcados_tipo_marcado_enum" NOT NULL, "ubicacion_id" uuid, "latitud" numeric(10,8), "longitud" numeric(11,8), "estado" "public"."marcados_estado_enum" NOT NULL DEFAULT 'validando', "notas" text, "sincronizado_offline" boolean NOT NULL DEFAULT false, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "estado_asistencia" "public"."marcados_estado_asistencia_enum", "minutos_retraso" integer NOT NULL DEFAULT '0', "minutos_trabajados" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_df393c9d94a16c636f82acd6498" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_MARCADO_ASISTENCIA" ON "marcados" ("estado_asistencia") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_MARCADO_ESTADO" ON "marcados" ("estado") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_MARCADO_DOCENTE_FECHA" ON "marcados" ("docente_id", "fecha") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ubicaciones_tipo_enum" AS ENUM('aula', 'laboratorio', 'hospital')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ubicaciones_estado_enum" AS ENUM('activa', 'inactiva')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ubicaciones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(255) NOT NULL, "tipo" "public"."ubicaciones_tipo_enum" NOT NULL, "edificio_campus" character varying(100), "capacidad" integer, "latitud" numeric(10,8), "longitud" numeric(11,8), "radio_validacion" integer NOT NULL DEFAULT '300', "estado" "public"."ubicaciones_estado_enum" NOT NULL DEFAULT 'activa', "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a9ce0b671142b83ebff02722cf9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."horarios_tipo_actividad_enum" AS ENUM('clase', 'laboratorio', 'rote')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."horarios_estado_enum" AS ENUM('activo', 'suspendido')`,
    );
    await queryRunner.query(
      `CREATE TABLE "horarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paralelo_id" uuid NOT NULL, "dia_semana" integer NOT NULL, "hora_inicio" TIME NOT NULL, "hora_fin" TIME NOT NULL, "ubicacion_id" uuid NOT NULL, "tipo_actividad" "public"."horarios_tipo_actividad_enum" NOT NULL, "estado" "public"."horarios_estado_enum" NOT NULL DEFAULT 'activo', CONSTRAINT "PK_c69b602fc8441125f1310a4858d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_HORARIO_PARALELO_DIA" ON "horarios" ("paralelo_id", "dia_semana") `,
    );
    await queryRunner.query(
      `CREATE TABLE "paralelos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "materia_id" uuid NOT NULL, "numero" character varying(5) NOT NULL, "docente_id" uuid NOT NULL, "capacidad" integer, "semestre_academico" character varying(10) NOT NULL, CONSTRAINT "PK_5700c8c67101f9c34d55b1f9593" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."docentes_estado_enum" AS ENUM('activo', 'inactivo')`,
    );
    await queryRunner.query(
      `CREATE TABLE "docentes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre_completo" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "cedula" character varying(20) NOT NULL, "departamento" character varying(100) NOT NULL, "estado" "public"."docentes_estado_enum" NOT NULL DEFAULT 'activo', "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_769bdd7fbd888da9480ca90f30c" UNIQUE ("email"), CONSTRAINT "UQ_ceec48bf3028f7d71d736695029" UNIQUE ("cedula"), CONSTRAINT "PK_5e3b015bd4d79caf4eadbf340a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."usuarios_rol_enum" AS ENUM('admin', 'docente', 'director')`,
    );
    await queryRunner.query(
      `CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "rol" "public"."usuarios_rol_enum" NOT NULL DEFAULT 'docente', "docente_id" uuid, "nombre_completo" character varying(255) NOT NULL, "activo" boolean NOT NULL DEFAULT true, "debe_cambiar_password" boolean NOT NULL DEFAULT true, "primer_login" boolean NOT NULL DEFAULT true, "intentos_fallidos" integer NOT NULL DEFAULT '0', "bloqueado" boolean NOT NULL DEFAULT false, "reset_token" character varying(255), "reset_expira" TIMESTAMP WITH TIME ZONE, "ultimo_acceso" TIMESTAMP WITH TIME ZONE, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auditoria" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "usuario_id" uuid, "accion" character varying(100) NOT NULL, "entidad" character varying(100) NOT NULL, "entidad_id" character varying(255), "datos" jsonb, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_135fe98308816fe3a2d458e6637" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sesiones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "usuario_id" uuid NOT NULL, "token" text NOT NULL, "ip" character varying(100), "user_agent" text, "activa" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e4237ef09f1dc217c1660f23253" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."justificaciones_estado_enum" AS ENUM('pendiente', 'aprobada', 'rechazada')`,
    );
    await queryRunner.query(
      `CREATE TABLE "justificaciones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "marcado_id" uuid NOT NULL, "docente_id" uuid NOT NULL, "motivo" text NOT NULL, "archivo" character varying(500), "estado" "public"."justificaciones_estado_enum" NOT NULL DEFAULT 'pendiente', "observaciones" text, "fecha_revision" TIMESTAMP WITH TIME ZONE, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_deb789868dab7efbd772accbce8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "marcados" ADD CONSTRAINT "FK_56ae7e4d8062f7e2992654a00c0" FOREIGN KEY ("docente_id") REFERENCES "docentes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marcados" ADD CONSTRAINT "FK_05f01b5c704129f50d27b7a6613" FOREIGN KEY ("horario_id") REFERENCES "horarios"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marcados" ADD CONSTRAINT "FK_5d767770cba545f8ff9973b749b" FOREIGN KEY ("ubicacion_id") REFERENCES "ubicaciones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios" ADD CONSTRAINT "FK_4d416ad51cff759276bb28d7f30" FOREIGN KEY ("paralelo_id") REFERENCES "paralelos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios" ADD CONSTRAINT "FK_4187713a57a3ea4ee0cb68606ba" FOREIGN KEY ("ubicacion_id") REFERENCES "ubicaciones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "paralelos" ADD CONSTRAINT "FK_84a17426b507b7610c44b3d37a0" FOREIGN KEY ("materia_id") REFERENCES "materias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "paralelos" ADD CONSTRAINT "FK_6613170f57d45ef24aa314f2417" FOREIGN KEY ("docente_id") REFERENCES "docentes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "paralelos" DROP CONSTRAINT "FK_6613170f57d45ef24aa314f2417"`,
    );
    await queryRunner.query(
      `ALTER TABLE "paralelos" DROP CONSTRAINT "FK_84a17426b507b7610c44b3d37a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios" DROP CONSTRAINT "FK_4187713a57a3ea4ee0cb68606ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "horarios" DROP CONSTRAINT "FK_4d416ad51cff759276bb28d7f30"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marcados" DROP CONSTRAINT "FK_5d767770cba545f8ff9973b749b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marcados" DROP CONSTRAINT "FK_05f01b5c704129f50d27b7a6613"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marcados" DROP CONSTRAINT "FK_56ae7e4d8062f7e2992654a00c0"`,
    );
    await queryRunner.query(`DROP TABLE "justificaciones"`);
    await queryRunner.query(`DROP TYPE "public"."justificaciones_estado_enum"`);
    await queryRunner.query(`DROP TABLE "sesiones"`);
    await queryRunner.query(`DROP TABLE "auditoria"`);
    await queryRunner.query(`DROP TABLE "usuarios"`);
    await queryRunner.query(`DROP TYPE "public"."usuarios_rol_enum"`);
    await queryRunner.query(`DROP TABLE "docentes"`);
    await queryRunner.query(`DROP TYPE "public"."docentes_estado_enum"`);
    await queryRunner.query(`DROP TABLE "paralelos"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_HORARIO_PARALELO_DIA"`);
    await queryRunner.query(`DROP TABLE "horarios"`);
    await queryRunner.query(`DROP TYPE "public"."horarios_estado_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."horarios_tipo_actividad_enum"`,
    );
    await queryRunner.query(`DROP TABLE "ubicaciones"`);
    await queryRunner.query(`DROP TYPE "public"."ubicaciones_estado_enum"`);
    await queryRunner.query(`DROP TYPE "public"."ubicaciones_tipo_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_MARCADO_DOCENTE_FECHA"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_MARCADO_ESTADO"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_MARCADO_ASISTENCIA"`);
    await queryRunner.query(`DROP TABLE "marcados"`);
    await queryRunner.query(
      `DROP TYPE "public"."marcados_estado_asistencia_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."marcados_estado_enum"`);
    await queryRunner.query(`DROP TYPE "public"."marcados_tipo_marcado_enum"`);
    await queryRunner.query(`DROP TABLE "materias"`);
    await queryRunner.query(`DROP TYPE "public"."materias_estado_enum"`);
  }
}
