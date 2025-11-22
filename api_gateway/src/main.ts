import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { getConfig } from './config';
import { setupSwagger } from './config/swagger.config';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const config = getConfig();

  const app = await NestFactory.create(AppModule);

  // ✅ Global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not in DTO
      forbidNonWhitelisted: true, // Throw error if extra properties
      transform: true, // Auto transform payloads to DTO instances
    }),
  );

  app.use(cookieParser());

  if (config.http.nodeEnv !== 'production') {
    setupSwagger(app);
  }

  app.setGlobalPrefix('api', {
    exclude: ['/docs'],
  });

  await app.listen(config.http.port);
  logger.log(
    `Api Gateway is running in : ${config.http.baseUrl}:${config.http.port}/${config.http.prefix}`,
  );
  if (config.http.nodeEnv !== 'production') {
    logger.log(
      `📘 Swagger Docs: ${config.http.baseUrl}:${config.http.port}/docs`,
    );
  }
}
bootstrap().catch((error) => {
  logger.error('Failed to start Api Gateway!', error);
  process.exit(1);
});
