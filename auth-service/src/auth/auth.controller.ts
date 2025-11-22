import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { errorHandling } from 'src/common/constants/error-handling';
import { LoggerService } from 'src/common/logger/logger.service';
import { AUTH_MESSAGE_PATTERNS } from 'src/common/constants/auth.message-pattern';

@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Đăng ký tài khoản mới
   */
  @MessagePattern(AUTH_MESSAGE_PATTERNS.REGISTER)
  async register(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Đăng nhập
   */
  @MessagePattern(AUTH_MESSAGE_PATTERNS.LOGIN)
  async login(@Payload() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException(errorHandling.invalidCredential.message);
    }
    return this.authService.login(user);
  }

  /**
   * Làm mới access token
   */
  @MessagePattern(AUTH_MESSAGE_PATTERNS.REFRESH_TOKEN)
  async refreshToken(@Payload() payload: { refreshToken: string; userId: string }) {
    return this.authService.refreshToken(payload.refreshToken, BigInt(payload.userId));
  }

  /**
   * Xác thực token JWT
   */
  @MessagePattern(AUTH_MESSAGE_PATTERNS.VERIFY)
  async validateToken(@Payload() payload: { token: string }) {
    try {
      // Verify và decode JWT
      const jwtPayload = await this.authService.verifyToken(payload.token);
      return {
        valid: true,
        payload: jwtPayload,
        user: {
          id: jwtPayload.sub,
          email: jwtPayload.email,
        },
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  /**
   * Đăng xuất
   */
  @MessagePattern(AUTH_MESSAGE_PATTERNS.LOGOUT)
  async logout(@Payload() payload: { refreshToken: string; userId: string }) {
    return this.authService.logout(payload.refreshToken, BigInt(payload.userId));
  }

  /**
   * Đăng xuất tất cả thiết bị
   */
  @MessagePattern(AUTH_MESSAGE_PATTERNS.LOGOUT_ALL_DEVICES)
  async logoutAllDevices(@Payload() payload: { userId: string }) {
    return this.authService.logoutAllDevices(BigInt(payload.userId));
  }
}
