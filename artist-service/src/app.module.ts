import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ArtistModule, HealthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
