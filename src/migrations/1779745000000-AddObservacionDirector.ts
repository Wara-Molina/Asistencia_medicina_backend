import { MigrationInterface, QueryRunner } from "typeorm";

export class AddObservacionDirector1779745000000 implements MigrationInterface {
  name = "AddObservacionDirector1779745000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE
      "public"."observaciones_director_tipo_enum"
      AS ENUM(
        'tardanza',
        'ausencia',
        'abandono',
        'desempeno',
        'general'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE
      "observaciones_director"
      (
        "id"
        uuid
        NOT NULL
        DEFAULT uuid_generate_v4(),

        "director_id"
        uuid
        NOT NULL,

        "docente_id"
        uuid
        NOT NULL,

        "tipo"
        "public"."observaciones_director_tipo_enum"
        NOT NULL,

        "descripcion"
        text
        NOT NULL,

        "resuelto"
        boolean
        NOT NULL
        DEFAULT false,

        "fecha_creacion"
        TIMESTAMPTZ
        NOT NULL
        DEFAULT now(),

        CONSTRAINT
        "PK_observaciones_director"
        PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE
      "observaciones_director"
    `);

    await queryRunner.query(`
      DROP TYPE
      "public"."observaciones_director_tipo_enum"
    `);
  }
}
