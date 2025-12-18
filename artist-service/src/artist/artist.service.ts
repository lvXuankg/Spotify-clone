import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  private throwArtistNotFound() {
    throw new NotFoundException({
      message: 'Không tìm thấy nghệ sĩ này',
    });
  }

  async create(createArtistDto: CreateArtistDto) {
    const artist = await this.prisma.artists.create({
      data: {
        user_id: createArtistDto.userId,
        display_name: createArtistDto.displayName,
        avatar_url: createArtistDto.avatarUrl,
        cover_image_url: createArtistDto.coverImageUrl,
        bio: createArtistDto.bio,
      },
    });

    return artist;
  }

  async findOne(id: string) {
    const artist = await this.prisma.artists.findUnique({
      where: { id },
    });

    if (!artist) {
      this.throwArtistNotFound();
    }

    return artist;
  }

  async findByUserId(userId: string) {
    const artist = await this.prisma.artists.findFirst({
      where: { user_id: userId },
    });

    if (!artist) {
      this.throwArtistNotFound();
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.prisma.artists.findUnique({
      where: { id },
    });

    if (!artist) {
      this.throwArtistNotFound();
    }

    const updatedArtist = await this.prisma.artists.update({
      where: { id },
      data: {
        display_name: updateArtistDto.displayName,
        avatar_url: updateArtistDto.avatarUrl,
        cover_image_url: updateArtistDto.coverImageUrl,
        bio: updateArtistDto.bio,
        updated_at: new Date(),
      },
    });

    return updatedArtist;
  }

  async delete(id: string) {
    const artist = await this.prisma.artists.findUnique({
      where: { id },
    });

    if (!artist) {
      this.throwArtistNotFound();
    }

    await this.prisma.artists.delete({
      where: { id },
    });

    return true;
  }

  async findAll(page: number = 1, limit: number = 20) {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(limit, 50);

    const [artists, total] = await this.prisma.$transaction([
      this.prisma.artists.findMany({
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        select: {
          id: true,
          display_name: true,
          avatar_url: true,
          created_at: true,
        },
        orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
      }),
      this.prisma.artists.count(),
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: artists.map((a) => ({
        id: a.id,
        displayName: a.display_name,
        avatarUrl: a.avatar_url,
        createdAt: a.created_at,
      })),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
        hasMore: safePage < totalPages,
      },
    };
  }
}
