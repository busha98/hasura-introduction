import * as fs from 'fs';
import * as appRoot from 'app-root-path';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IsPort, IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

class SystemConfig {
  port: string;
  globalSalt: string;
}

class JwtConfig {
  jwtPublicKey: string;
  jwtPrivateKey: string;
}

export class UsersServiceConfiguration {
  system: SystemConfig;
  jwt: JwtConfig;
}

function ConfigFactory(): UsersServiceConfiguration {
  return {
    system: {
      port: process.env.PORT,
      globalSalt: process.env.GLOBAL_SALT,
    },
    jwt: {
      jwtPublicKey: fs.readFileSync(
        appRoot.path + process.env.PATH_TO_PUBLIC_KEY,
        { encoding: 'utf8', flag: 'r' },
      ),
      jwtPrivateKey: fs.readFileSync(
        appRoot.path + process.env.PATH_TO_PRIVATE_KEY,
        { encoding: 'utf8', flag: 'r' },
      ),
    },
  };
}

class ConfigSchema {
  @IsString()
  GLOBAL_SALT: string;
  @IsPort()
  PORT: number;
  @IsString()
  PATH_TO_PUBLIC_KEY;
  @IsString()
  PATH_TO_PRIVATE_KEY;
}

function validate(config: Record<string, any>): Record<string, any> {
  const logger = new Logger();

  logger.log('dirname', __dirname);
  const cl = plainToClass(ConfigSchema, config, {
    enableImplicitConversion: false,
  });
  const errors = validateSync(cl);

  if (errors && errors.length > 0) {
    const stringifiedErrors = errors.map(e => ({
      property: e.property,
      value: e.value,
      valueType: typeof e.value,
      constraints: Object.values(e.constraints),
    }));

    const error = new Error(
      `Configuration Error, check environments or .env file. ${JSON.stringify(
        stringifiedErrors,
      )}`,
    );
    throw error;
  }

  return cl;
}

@Module({
  imports: [ConfigModule.forRoot({ load: [ConfigFactory], validate })],
  providers: [ConfigService],
})
export class ConfigurationModule {}
