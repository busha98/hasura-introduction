module.exports = {
  type: 'postgres',
  port: 5555,
  host: '127.0.0.1',
  username: 'postgres',
  password: 'password',
  database: 'dev',
  synchronize: true,
  logging: true,
  entities: ['dist/**/entities/**/*.js'],
  migrations: [`dist/apps/migrations/*.js`],
  cli: {
    entitiesDir: 'libs/shared/src/entities',
    migrationsDir: `apps/migrations/src`,
  },
};
