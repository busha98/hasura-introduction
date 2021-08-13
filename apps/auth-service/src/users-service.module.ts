import { ConfigService } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { DBModule } from './db.module';
import { UsersServiceConfiguration } from './configuration.module';

@Module({})
export class UsersServiceModule {
  static register(config: ConfigService<UsersServiceConfiguration>): DynamicModule {
    return {
      module: UsersServiceModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () =>
            Object.assign(await getConnectionOptions(), {
              autoLoadEntities: true,
            }),
        }),
        AuthModule,
        DBModule,
      ],
      providers: [{ provide: ConfigService, useValue: config }],
    };
  }
}
