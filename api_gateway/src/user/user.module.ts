import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MicroserviceClientsModule } from 'src/microservice-clients/microservice-clients.module';

@Module({
  imports: [MicroserviceClientsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
