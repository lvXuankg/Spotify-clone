import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { errorHandling } from 'src/common/constants/error-handling';
import { LoginDto } from './dto/login.dto';
import { User } from '../../generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import { responseMessages } from 'src/common/constants/response-message';

export interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }

    return null;
  }

  private generateUsername(prefix = 'user') {
    return `${prefix}${Date.now()}`;
  }

  private async generateRefreshToken(userId: bigint): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await this.prisma.refreshtoken.create({
      data: {
        hashed_refresh_token: hashedToken,
        user_id: userId,
        expires_at: expiresAt,
      },
    });

    return token;
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingEmail = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingEmail) {
      throw new ConflictException(errorHandling.duplicateEmail.message);
    }

    let generatedUsername = this.generateUsername();
    let retryCount = 3;

    while (
      retryCount > 0 &&
      (await this.prisma.user.findFirst({ where: { username: generatedUsername } }))
    ) {
      generatedUsername = this.generateUsername();
      retryCount--;
    }

    const stillExists = await this.prisma.user.findUnique({
      where: { username: generatedUsername },
    });

    if (stillExists) {
      throw new ConflictException('Hệ thống đang bận, vui lòng thử lại sau');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username: generatedUsername,
        role: 'member',
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async loginLocal(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException(errorHandling.invalidCredential);
    }

    return this.login(user);
  }

  async login(user: User) {
    const payload: JwtPayload = { sub: user.id.toString(), email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string, userId: bigint) {
    const tokenRecords = await this.prisma.refreshtoken.findMany({
      where: {
        user_id: userId,
        expires_at: { gt: new Date() },
      },
      include: { User: true },
    });

    let tokenRecord: (typeof tokenRecords)[number] | null = null;
    for (const token of tokenRecords) {
      const isMatch = await bcrypt.compare(refreshToken, token.hashed_refresh_token);
      if (isMatch) {
        tokenRecord = token;
        break;
      }
    }

    if (!tokenRecord) {
      throw new UnauthorizedException(errorHandling.invalidToken);
    }

    const payload: JwtPayload = {
      sub: tokenRecord.User.id.toString(),
      email: tokenRecord.User.email,
    };

    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = await this.generateRefreshToken(tokenRecord.User.id);

    // ✅ Chỉ xóa token hiện tại, giữ lại token từ devices khác
    await this.prisma.refreshtoken.delete({
      where: { id: tokenRecord.id },
    });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      user: {
        id: tokenRecord.User.id.toString(),
        email: tokenRecord.User.email,
        username: tokenRecord.User.username,
      },
    };
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException(errorHandling.invalidToken);
    }
  }

  async logout(refreshToken: string, userId: bigint) {
    // Find all non-expired tokens for user
    const tokenRecords = await this.prisma.refreshtoken.findMany({
      where: {
        user_id: userId,
        expires_at: { gt: new Date() },
      },
    });

    // Find matching token by comparing hashes
    let matchingToken: (typeof tokenRecords)[number] | null = null;
    for (const token of tokenRecords) {
      const isMatch = await bcrypt.compare(refreshToken, token.hashed_refresh_token);
      if (isMatch) {
        matchingToken = token;
        break;
      }
    }

    if (!matchingToken) {
      throw new UnauthorizedException(errorHandling.invalidToken);
    }

    // Delete only this device's token
    await this.prisma.refreshtoken.delete({
      where: { id: matchingToken.id },
    });

    return { message: responseMessages.logoutOneDevice };
  }

  async logoutAllDevices(userId: bigint) {
    // Delete all refresh tokens for user
    const result = await this.prisma.refreshtoken.deleteMany({
      where: { user_id: userId },
    });

    return {
      message: responseMessages.logoutAllDevices,
      devicesLoggedOut: result.count,
    };
  }
}
