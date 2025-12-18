import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { errorHandling } from 'src/common/constants/error-handling';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { responseMessages } from 'src/common/constants/response-message';
import type { users } from 'src/common/types/prisma.types';

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
    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (user && user.password_hash && (await bcrypt.compare(password, user.password_hash))) {
      const { password_hash: _, ...result } = user;
      return result;
    }

    return null;
  }

  private generateUsername(prefix = 'user') {
    return `${prefix}${Date.now()}`;
  }

  private async generateUniqueUsername(prefix = 'user', maxRetries = 5): Promise<string> {
    for (let i = 0; i < maxRetries; i++) {
      const username = this.generateUsername(prefix);
      const existing = await this.prisma.users.count({
        where: { username },
      });
      if (existing === 0) {
        return username;
      }
    }
    throw new ConflictException('Unable to generate unique username');
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await this.prisma.refresh_tokens.create({
      data: {
        token_hash: hashedToken,
        user_id: userId,
        expires_at: expiresAt,
      },
    });

    return token;
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingEmail = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException(errorHandling.duplicateEmail.message);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = await this.generateUniqueUsername();

    const user = await this.prisma.users.create({
      data: {
        email,
        password_hash: hashedPassword,
        username,
        role: 'MEMBER',
      },
    });

    const { password_hash: _, ...result } = user;
    return result;
  }

  async loginLocal(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException(errorHandling.invalidCredential);
    }

    return this.login(user);
  }

  async login(user: users) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role || undefined };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string, userId: string) {
    const tokenRecords = await this.prisma.refresh_tokens.findMany({
      where: {
        user_id: userId,
        expires_at: { gt: new Date() },
      },
      include: { users: true },
    });

    let tokenRecord: (typeof tokenRecords)[number] | null = null;
    for (const token of tokenRecords) {
      const isMatch = await bcrypt.compare(refreshToken, token.token_hash);
      if (isMatch) {
        tokenRecord = token;
        break;
      }
    }

    if (!tokenRecord) {
      throw new UnauthorizedException(errorHandling.invalidToken);
    }

    const payload: JwtPayload = {
      sub: tokenRecord.users.id,
      email: tokenRecord.users.email,
      role: tokenRecord.users.role || undefined,
    };

    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = await this.generateRefreshToken(tokenRecord.users.id);

    // ✅ Chỉ xóa token hiện tại, giữ lại token từ devices khác
    // Sử dụng deleteMany để tránh error nếu record không tồn tại
    await this.prisma.refresh_tokens.deleteMany({
      where: { id: tokenRecord.id },
    });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      user: {
        id: tokenRecord.users.id,
        email: tokenRecord.users.email,
        username: tokenRecord.users.username,
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

  async logout(refreshToken: string, userId: string) {
    // Find all non-expired tokens for user
    const tokenRecords = await this.prisma.refresh_tokens.findMany({
      where: {
        user_id: userId,
        expires_at: { gt: new Date() },
      },
    });

    // Find matching token by comparing hashes
    let matchingToken: (typeof tokenRecords)[number] | null = null;
    for (const token of tokenRecords) {
      const isMatch = await bcrypt.compare(refreshToken, token.token_hash);
      if (isMatch) {
        matchingToken = token;
        break;
      }
    }

    if (!matchingToken) {
      throw new UnauthorizedException(errorHandling.invalidToken);
    }

    // Delete only this device's token
    await this.prisma.refresh_tokens.delete({
      where: { id: matchingToken.id },
    });

    return { message: responseMessages.logoutOneDevice };
  }

  async logoutAllDevices(userId: string) {
    // Delete all refresh tokens for user
    const result = await this.prisma.refresh_tokens.deleteMany({
      where: { user_id: userId },
    });

    return {
      message: responseMessages.logoutAllDevices,
      devicesLoggedOut: result.count,
    };
  }
}
