import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma.health';
import { RabbitMQHealthIndicator } from './rabbitmq.health';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator, RabbitMQHealthIndicator],
})
export class HealthModule {}
