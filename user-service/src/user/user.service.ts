import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { errorHandling } from 'src/common/constants/error-handling';
import { getConfig } from 'src/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(errorHandling.userNotFound.message);
    }

    const { password_hash: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const { username, email } = data || {};

    console.log(data);

    if (username) {
      const existingUser = await this.prisma.users.findFirst({
        where: {
          AND: [{ username }, { id: { not: userId } }],
        },
        select: { id: true },
      });

      if (existingUser) {
        throw new ConflictException(errorHandling.duplicateUsername.message);
      }
    }

    if (email) {
      const existingUser = await this.prisma.users.findFirst({
        where: {
          AND: [{ email }, { id: { not: userId } }],
        },
        select: { id: true },
      });

      if (existingUser) {
        throw new ConflictException(errorHandling.duplicateEmail.message);
      }
    }

    const result = await this.prisma.users.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.username && { username: data.username }),
        ...(data.bio && { bio: data.bio }),
        ...(data.email && { email: data.email }),
        ...(data.avatarUrl && { avatar_url: data.avatarUrl }),
        ...(data.facebookUrl && { facebook_url: data.facebookUrl }),
        ...(data.zaloPhone && { zalo_phone: data.zaloPhone }),
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        avatar_url: true,
        facebook_url: true,
        zalo_phone: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return result;
  }
}
