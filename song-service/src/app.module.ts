import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { SongModule } from './song/song.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [PrismaModule, HealthModule, SongModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
