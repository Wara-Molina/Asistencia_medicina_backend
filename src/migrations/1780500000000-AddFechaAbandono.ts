// src/migrations/1780500000000-AddFechaAbandono.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFechaAbandono1780500000000
  implements MigrationInterface
{
  public async up(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE marcados
      ADD COLUMN fecha_abandono TIMESTAMPTZ NULL
    `);
  }

  public async down(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE marcados
      DROP COLUMN fecha_abandono
    `);
  }
}