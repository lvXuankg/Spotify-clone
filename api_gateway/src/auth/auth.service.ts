import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { LoggerService } from 'src/common/logger/logger.service';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { LoginDto } from './dto/login.dto';
import { AUTH_MESSAGE_PATTERNS } from './constants/auth.message-pattern';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
    private readonly logger: LoggerService,
  ) {}

  async register(data: RegisterDto) {
    return sendMicroserviceRequest(
      this.client,
      AUTH_MESSAGE_PATTERNS.REGISTER,
      data,
    );
  }

  async login(data: LoginDto) {
    return sendMicroserviceRequest(
      this.client,
      AUTH_MESSAGE_PATTERNS.LOGIN,
      data,
    );
  }

  async refreshToken(refreshToken: string, userId: string) {
    return sendMicroserviceRequest(
      this.client,
      AUTH_MESSAGE_PATTERNS.REFRESH_TOKEN,
      {
        refreshToken,
        userId,
      },
    );
  }

  async logout(refreshToken: string, userId: string) {
    return sendMicroserviceRequest(this.client, AUTH_MESSAGE_PATTERNS.LOGOUT, {
      refreshToken,
      userId,
    });
  }

  async logoutAllDevices(userId: string) {
    return sendMicroserviceRequest(
      this.client,
      AUTH_MESSAGE_PATTERNS.LOGOUT_ALL_DEVICES,
      {
        userId,
      },
    );
  }

  async verify(token: string) {
    return sendMicroserviceRequest(this.client, AUTH_MESSAGE_PATTERNS.VERIFY, {
      token,
    });
  }
}
