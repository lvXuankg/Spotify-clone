import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [PrismaModule, SearchModule],
  controllers: [SongController],
  providers: [SongService],
})
export class SongModule {}
