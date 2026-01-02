import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { MicroserviceClientsModule } from 'src/microservice-clients/microservice-clients.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [MicroserviceClientsModule, RedisModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
