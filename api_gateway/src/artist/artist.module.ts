import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { MicroserviceClientsModule } from 'src/microservice-clients/microservice-clients.module';

@Module({
  imports: [MicroserviceClientsModule],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
