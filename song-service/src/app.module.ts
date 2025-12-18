import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { SongModule } from './song/song.module';

@Module({
  imports: [PrismaModule, HealthModule, SongModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
