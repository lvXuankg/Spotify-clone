import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [HealthModule, PrismaModule, PlaylistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
