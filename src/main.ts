import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(helmet());

  const configService = app.get(ConfigService);
  const port = Number(configService.get<string>('PORT')) || 3000;
  const logger = new Logger('Bootstrap');

  const mongoUrl = configService.get<string>('DATABASE_URL') ?? '';
  let mongoTarget = 'unknown';
  try {
    const parsed = new URL(mongoUrl);
    mongoTarget = `${parsed.protocol}//${parsed.hostname}${
      parsed.port ? ':' + parsed.port : ''
    }${parsed.pathname}`;
  } catch {
    mongoTarget = '[unparseable mongo url]';
  }

  const config = new DocumentBuilder()
    .setTitle('Voice Owl Conversation Service')
    .setDescription('API documentation for sessions and events')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  logger.log(`Connecting to Mongo at ${mongoTarget}`);
  await app
    .listen(port)
    .then(() => logger.log(`HTTP server listening on port ${port}`));
}
bootstrap();
