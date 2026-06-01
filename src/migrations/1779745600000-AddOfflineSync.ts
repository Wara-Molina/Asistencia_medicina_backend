import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOfflineSync1779745600000 implements MigrationInterface {
  name = "AddOfflineSync1779745600000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "marcados"
      ADD COLUMN
      "offline_id"
      varchar(100)
    `);

    await queryRunner.query(`
      ALTER TABLE "marcados"
      ADD COLUMN
      "fecha_dispositivo"
      timestamptz
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX
      "IDX_MARCADO_OFFLINE"
      ON "marcados"
      ("offline_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX
      "IDX_MARCADO_OFFLINE"
    `);

    await queryRunner.query(`
      ALTER TABLE "marcados"
      DROP COLUMN
      "fecha_dispositivo"
    `);

    await queryRunner.query(`
      ALTER TABLE "marcados"
      DROP COLUMN
      "offline_id"
    `);
  }
}
