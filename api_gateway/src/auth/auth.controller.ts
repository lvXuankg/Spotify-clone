import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { swaggerResponses } from '../common/constants/swagger-response';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { errorHandling } from 'src/common/constants/error-handling';
import { RefreshDto } from './dto/refresh.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Đăng ký tài khoản người dùng',
    description: 'Đăng ký với email + mật khẩu',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Dữ liệu đăng ký',
    examples: {
      example1: {
        summary: 'Valid registration',
        value: {
          email: 'user@example.com',
          password: 'SecurePass123!@',
        },
      },
    },
  })
  @ApiResponse(swaggerResponses.register.success)
  @ApiResponse(swaggerResponses.register.error)
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập tài khoản',
    description:
      'Đăng nhập với email + mật khẩu, nhận access token và refresh token',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Dữ liệu đăng nhập',
    examples: {
      example1: {
        summary: 'Valid login',
        value: {
          email: 'user@example.com',
          password: 'SecurePass123!@',
        },
      },
    },
  })
  @ApiResponse(swaggerResponses.login.success)
  @ApiResponse(swaggerResponses.login.error)
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response, // cho phép vừa set cookie vừa trả về kết quả
  ) {
    const result = await this.authService.login(data);

    const { access_token, refresh_token } = result;

    res.cookie('accessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 phút
    });

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
    });

    return result.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng xuất khỏi 1 thiết bị',
    description:
      'Xóa refresh token của thiết bị hiện tại. Người dùng vẫn có thể sử dụng các thiết bị khác',
  })
  @ApiResponse(swaggerResponses.logout.success)
  @ApiResponse(swaggerResponses.logout.error)
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    const userId = req.user.userId;

    if (!refreshToken) {
      throw new UnauthorizedException({
        message: errorHandling.missingRefreshToken,
        code: errorHandling.missingRefreshToken.code,
      });
    }

    const result = await this.authService.logout(refreshToken, userId);

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 phút
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
    });

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logoutAllDevices')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng xuất khỏi tất cả thiết bị',
    description:
      'Xóa tất cả refresh tokens, người dùng phải đăng nhập lại trên mọi thiết bị',
  })
  @ApiResponse(swaggerResponses.logoutAll.success)
  @ApiResponse(swaggerResponses.logoutAll.error)
  async logoutAllDevices(@Request() req) {
    const userId = req.user.userId;

    return this.authService.logoutAllDevices(userId);
  }

  @Post('refreshToken')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Làm mới Access Token',
    description:
      'Sử dụng Refresh Token để lấy Access Token mới. Access Token cũ sẽ hết hạn trong 15 phút',
  })
  @ApiBody({
    type: RefreshDto,
    description: 'User ID để refresh token',
    examples: {
      example1: {
        summary: 'Valid refresh',
        value: {
          userId: '1',
        },
      },
    },
  })
  @ApiResponse(swaggerResponses.refresh.success)
  @ApiResponse(swaggerResponses.refresh.error)
  async refreshToken(
    @Body() dto: RefreshDto,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException({
        message: errorHandling.missingRefreshToken.message,
        code: errorHandling.missingRefreshToken.code,
      });
    }

    const result = await this.authService.refreshToken(
      refreshToken,
      dto.userId,
    );

    const { access_token, refresh_token } = result;

    res.cookie('accessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 phút
    });

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
    });

    return result;
  }
}
