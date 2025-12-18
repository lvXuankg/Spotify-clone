import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [HealthModule, PrismaModule, AlbumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
