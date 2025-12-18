import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { MicroserviceClientsModule } from 'src/microservice-clients/microservice-clients.module';

@Module({
  imports: [MicroserviceClientsModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
