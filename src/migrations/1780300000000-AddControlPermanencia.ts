// src/migrations/1780300000000-AddControlPermanencia.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class AddControlPermanencia1780300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "controles_permanencia",

        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },

          {
            name: "marcado_id",
            type: "uuid",
            isNullable: false,
          },

          {
            name: "latitud",
            type: "decimal",
            precision: 10,
            scale: 8,
          },

          {
            name: "longitud",
            type: "decimal",
            precision: 11,
            scale: 8,
          },

          {
            name: "distancia_metros",
            type: "decimal",
            precision: 10,
            scale: 2,
          },

          {
            name: "dentro_perimetro",
            type: "boolean",
            default: false,
          },

          {
            name: "fecha_control",
            type: "timestamptz",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "controles_permanencia",
      new TableForeignKey({
        columnNames: ["marcado_id"],

        referencedTableName: "marcados",

        referencedColumnNames: ["id"],

        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createIndex(
      "controles_permanencia",
      new TableIndex({
        name: "IDX_CONTROL_MARCADO",

        columnNames: ["marcado_id"],
      }),
    );

    await queryRunner.createIndex(
      "controles_permanencia",
      new TableIndex({
        name: "IDX_CONTROL_FECHA",

        columnNames: ["fecha_control"],
      }),
    );
    await queryRunner.createIndex(
  "controles_permanencia",
  new TableIndex({
    name: "IDX_CONTROL_MARCADO_FECHA",
    columnNames: ["marcado_id", "fecha_control"],
  }),
);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("controles_permanencia");
  }
}
