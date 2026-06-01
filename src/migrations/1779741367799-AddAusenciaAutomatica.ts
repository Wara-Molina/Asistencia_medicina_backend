// src/migrations/1779741367799-AddAusenciaAutomatica.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAusenciaAutomatica1779741367799 implements MigrationInterface {
  name = "AddAusenciaAutomatica1779741367799";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE marcados
      ALTER COLUMN hora_inicio
      DROP NOT NULL
    `);

    await queryRunner.query(`
      ALTER TYPE public.marcados_tipo_marcado_enum
      RENAME TO marcados_tipo_marcado_enum_old
    `);

    await queryRunner.query(`
      CREATE TYPE public.marcados_tipo_marcado_enum
      AS ENUM(
        'biometrico',
        'app_campus',
        'app_laboratorio',
        'app_hospital',
        'automatico'
      )
    `);

    await queryRunner.query(`
      ALTER TABLE marcados
      ALTER COLUMN tipo_marcado
      TYPE public.marcados_tipo_marcado_enum
      USING tipo_marcado::text::public.marcados_tipo_marcado_enum
    `);

    await queryRunner.query(`
      DROP TYPE public.marcados_tipo_marcado_enum_old
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE public.marcados_tipo_marcado_enum_old
      AS ENUM(
        'biometrico',
        'app_campus',
        'app_laboratorio',
        'app_hospital'
      )
    `);

    await queryRunner.query(`
      ALTER TABLE marcados
      ALTER COLUMN tipo_marcado
      TYPE public.marcados_tipo_marcado_enum_old
      USING tipo_marcado::text::public.marcados_tipo_marcado_enum_old
    `);

    await queryRunner.query(`
      DROP TYPE public.marcados_tipo_marcado_enum
    `);

    await queryRunner.query(`
      ALTER TYPE public.marcados_tipo_marcado_enum_old
      RENAME TO marcados_tipo_marcado_enum
    `);

    await queryRunner.query(`
      ALTER TABLE marcados
      ALTER COLUMN hora_inicio
      SET NOT NULL
    `);
  }
}
