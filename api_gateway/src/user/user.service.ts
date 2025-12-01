import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { USER_MESSAGE_PATTERNS } from './constants/user.message-pattern';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async getProfile(userId: string) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.GET_PROFILE,
      {
        userId,
      },
    );
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.UPDATE_PROFILE,
      {
        userId,
        data,
      },
    );
  }
}
