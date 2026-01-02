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

  /**
   * Get all users with pagination (Admin only)
   */
  async getAllUsers(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { username: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.users.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          avatar_url: true,
          role: true,
          created_at: true,
          updated_at: true,
        },
      }),
      this.prisma.users.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(userId: string) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(errorHandling.userNotFound.message);
    }

    await this.prisma.users.delete({ where: { id: userId } });

    return { success: true, message: 'User deleted successfully' };
  }

  /**
   * Update user role (Admin only)
   */
  async updateUserRole(userId: string, role: string) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(errorHandling.userNotFound.message);
    }

    const updated = await this.prisma.users.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return updated;
  }

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
        ...(data.country && { country: data.country }),
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
        country: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return result;
  }
}
