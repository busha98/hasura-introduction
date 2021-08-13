import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { UsersServiceModule } from './users-service.module';
import { ConfigurationModule, UsersServiceConfiguration } from './configuration.module';
import { json } from 'body-parser';
import { ApiExceptionsFilter } from '@app/shared/exceptions/exceptions.filter';

async function bootstrap() {
  const c = await NestFactory.createApplicationContext(ConfigurationModule);
  const config: ConfigService<UsersServiceConfiguration> = c.get(ConfigService);
  await c.close();

  const app = await NestFactory.create(UsersServiceModule.register(config), { cors: true });

  const options = new DocumentBuilder()
    .setTitle('Users Service')
    .setVersion('0.0.1')
    .addBearerAuth();

  const document = SwaggerModule.createDocument(app, options.build());

  SwaggerModule.setup('api/swagger', app, document);

  app.use(json({ limit: '3mb' }));

  app.useGlobalFilters(new ApiExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  await app.listen(process.env.PORT);
}

bootstrap();
