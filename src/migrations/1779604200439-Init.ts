import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1779604200439 implements MigrationInterface {
    name = 'Init1779604200439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."justificaciones_tipo_enum" AS ENUM('tardanza', 'ausencia', 'abandono', 'salida_anticipada')`);
        await queryRunner.query(`ALTER TABLE "justificaciones" ADD "tipo" "public"."justificaciones_tipo_enum" NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_MARCADO_ASISTENCIA" ON "marcados" ("estado_asistencia") `);
        await queryRunner.query(`CREATE INDEX "IDX_MARCADO_ESTADO" ON "marcados" ("estado") `);
        await queryRunner.query(`CREATE INDEX "IDX_MARCADO_DOCENTE_FECHA" ON "marcados" ("docente_id", "fecha") `);
        await queryRunner.query(`CREATE INDEX "IDX_HORARIO_PARALELO_DIA" ON "horarios" ("paralelo_id", "dia_semana") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_HORARIO_PARALELO_DIA"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MARCADO_DOCENTE_FECHA"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MARCADO_ESTADO"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MARCADO_ASISTENCIA"`);
        await queryRunner.query(`ALTER TABLE "justificaciones" DROP COLUMN "tipo"`);
        await queryRunner.query(`DROP TYPE "public"."justificaciones_tipo_enum"`);
    }

}
