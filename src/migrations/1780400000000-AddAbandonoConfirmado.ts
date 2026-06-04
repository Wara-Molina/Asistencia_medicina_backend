import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAbandonoConfirmado1780400000000
  implements MigrationInterface
{
  name = "AddAbandonoConfirmado1780400000000";

  public async up(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE marcados
      ADD COLUMN IF NOT EXISTS
      abandono_confirmado boolean
      NOT NULL DEFAULT false
    `);
  }

  public async down(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE marcados
      DROP COLUMN IF EXISTS
      abandono_confirmado
    `);
  }
}