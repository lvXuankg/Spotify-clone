import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { MicroserviceClientsModule } from 'src/microservice-clients/microservice-clients.module';

@Module({
  imports: [MicroserviceClientsModule],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}
