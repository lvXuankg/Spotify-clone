import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { MicroserviceClientsModule } from '../microservice-clients/microservice-clients.module';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  imports: [MicroserviceClientsModule, LoggerModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
