import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongService {
  constructor(private prisma: PrismaService) {}

  async create(albumId: string, dto: CreateSongDto) {
    // Verify album exists
    const album = await this.prisma.albums.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      throw new BadRequestException({ message: 'Album không tồn tại' });
    }

    return this.prisma.songs.create({
      data: {
        album_id: albumId,
        title: dto.title,
        duration_seconds: dto.durationSeconds,
        audio_url: dto.audioUrl,
        track_number: dto.trackNumber,
        disc_number: dto.discNumber || 1,
        is_explicit: dto.isExplicit || false,
        bitrate: dto.bitrate,
      },
    });
  }

  async findAll(albumId: string) {
    return this.prisma.songs.findMany({
      where: {
        album_id: albumId,
      },
      orderBy: [{ disc_number: 'asc' }, { track_number: 'asc' }],
    });
  }

  async findOne(id: string) {
    const song = await this.prisma.songs.findUnique({
      where: { id },
      include: {
        albums: {
          select: {
            id: true,
            title: true,
            artists: {
              select: {
                id: true,
                display_name: true,
              },
            },
          },
        },
      },
    });

    if (!song) {
      throw new NotFoundException({ message: 'Bài hát không tồn tại' });
    }

    return song;
  }

  async update(id: string, dto: UpdateSongDto) {
    // Verify song exists
    const song = await this.findOne(id);

    return this.prisma.songs.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.durationSeconds !== undefined && {
          duration_seconds: dto.durationSeconds,
        }),
        ...(dto.audioUrl !== undefined && { audio_url: dto.audioUrl }),
        ...(dto.trackNumber !== undefined && { track_number: dto.trackNumber }),
        ...(dto.discNumber !== undefined && { disc_number: dto.discNumber }),
        ...(dto.isExplicit !== undefined && { is_explicit: dto.isExplicit }),
        ...(dto.bitrate !== undefined && { bitrate: dto.bitrate }),
      },
    });
  }

  async delete(id: string) {
    // Verify song exists
    await this.findOne(id);

    return this.prisma.songs.delete({
      where: { id },
    });
  }

  async incrementPlayCount(id: string) {
    const song = await this.findOne(id);

    return this.prisma.songs.update({
      where: { id },
      data: {
        play_count: {
          increment: 1,
        },
      },
    });
  }

  async searchByTitle(keyword: string, page = 1, limit = 20) {
    if (!keyword || keyword.trim() === '') {
      throw new BadRequestException('Từ khóa tìm kiếm không hợp lệ');
    }

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 50);
    const skip = (safePage - 1) * safeLimit;

    const [songs, total] = await this.prisma.$transaction([
      this.prisma.songs.findMany({
        where: {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take: safeLimit,
        include: {
          albums: {
            select: {
              id: true,
              title: true,
              artists: {
                select: {
                  id: true,
                  display_name: true,
                },
              },
            },
          },
        },
      }),

      this.prisma.songs.count({
        where: {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: songs,
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
