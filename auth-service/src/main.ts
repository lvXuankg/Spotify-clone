import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { getConfig } from './config';
import { BigIntSerializerInterceptor } from './common/interceptors/bigint.serializer.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const config = getConfig();

  // Dạy cho JSON.stringify cách xử lý BigInt
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  // --- 1. Cấu hình Microservice (RabbitMQ) ---
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: config.rabbitmq.urls,
      queue: config.rabbitmq.queue,
      queueOptions: {
        durable: config.rabbitmq.durable,
      },
    },
  });

  // Add BigInt Serializer Interceptor
  microservice.useGlobalInterceptors(new BigIntSerializerInterceptor());

  // rpc exception filter
  microservice.useGlobalFilters(new AllExceptionsFilter());

  // validationPipe for payload
  microservice.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // --- 2. Cấu hình HTTP Server (Health Check) ---
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.http.prefix);

  // --- 3. Khởi chạy cả hai ---
  await microservice.listen();
  logger.log(`🚀 RabbitMQ Microservice connected to queue: ${config.rabbitmq.queue}`);

  await app.listen(config.http.port);
  logger.log(
    `✅ Auth Service running at ${config.http.baseUrl}:${config.http.port}/${config.http.prefix}`,
  );
  logger.log(
    `📊 Health Check: ${config.http.baseUrl}:${config.http.port}/${config.http.prefix}/health`,
  );
}

bootstrap().catch((error) => {
  logger.error('❌ Failed to start Auth Service:', error);
  process.exit(1);
});
