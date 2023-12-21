import { MigrationInterface, QueryRunner } from 'typeorm';

export class Camera1702566882641 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "camera" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "camera"`);
  }
}
