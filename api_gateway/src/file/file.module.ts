import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MicroserviceClientsModule } from 'src/microservice-clients/microservice-clients.module';

@Module({
  imports: [MicroserviceClientsModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
