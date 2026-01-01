import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';
import { RabbitMQHealthIndicator } from './rabbitmq.health';
import { MessagePattern } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private rabbitHealth: RabbitMQHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prismaHealth.isHealthy('database'),
      () => this.rabbitHealth.isHealthy('rabbitmq'),
    ]);
  }

  @MessagePattern('health.ping')
  async healthPing() {
    return {
      status: 'ok',
      service: 'user-service',
      timestamp: new Date().toISOString(),
    };
  }
}
