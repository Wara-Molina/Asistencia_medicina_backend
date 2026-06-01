import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJustificadoToMarcado1780196000000 implements MigrationInterface {
  name = "AddJustificadoToMarcado1780196000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE marcados
      ADD COLUMN IF NOT EXISTS justificado
      boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE marcados
      DROP COLUMN IF EXISTS justificado
    `);
  }
}
