import { MigrationInterface, QueryRunner } from 'typeorm';

export class roles1628707816431 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        INSERT INTO "role" (id, value) values (1, 'admin'),(2, 'user');
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
