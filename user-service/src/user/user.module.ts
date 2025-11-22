import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PaginationService } from 'src/common/pagination/pagination.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PaginationService],
})
export class UserModule {}
