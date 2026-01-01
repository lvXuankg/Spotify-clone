import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { StreamModule } from './stream/stream.module';

@Module({
  imports: [PrismaModule, HealthModule, StreamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
