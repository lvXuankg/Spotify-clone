import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  private throwNotFoundAlbumException() {
    throw new NotFoundException({ message: 'Không tìm thấy album này' });
  }

  async create(artistId: string, dto: CreateAlbumDto) {
    return this.prisma.albums.create({
      data: {
        title: dto.title,
        cover_url: dto.coverUrl,
        release_date: dto.releaseDate ? new Date(dto.releaseDate) : null,
        artist_id: artistId,
        type: dto.type,
      },
    });
  }

  async findByArtist(artistId: string, page: number = 1, limit: number = 10) {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 50);

    const [albums, total] = await this.prisma.$transaction([
      this.prisma.albums.findMany({
        where: {
          artist_id: artistId,
        },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        select: {
          id: true,
          title: true,
          cover_url: true,
          type: true,
          release_date: true,
        },
        orderBy: {
          release_date: 'desc',
        },
      }),
      this.prisma.albums.count({
        where: {
          artist_id: artistId,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: albums.map((a) => ({
        id: a.id,
        title: a.title,
        coverUrl: a.cover_url,
        type: a.type,
        releaseDate: a.release_date,
      })),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
        hasMore: safePage * safeLimit < total,
      },
    };
  }

  async update(id: string, dto: UpdateAlbumDto) {
    const album = await this.prisma.albums.findFirst({
      where: {
        id,
      },
    });

    if (!album) {
      this.throwNotFoundAlbumException();
    }

    return this.prisma.albums.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.coverUrl && { cover_url: dto.coverUrl }),
        ...(dto.releaseDate && { release_date: new Date(dto.releaseDate) }),
        ...(dto.type && { type: dto.type }),
      },
    });
  }

  async delete(id: string) {
    const album = await this.prisma.albums.findFirst({
      where: {
        id,
      },
    });

    if (!album) {
      this.throwNotFoundAlbumException();
    }

    await this.prisma.albums.delete({
      where: { id },
    });

    return true;
  }

  async findOne(id: string) {
    return this.prisma.albums.findUnique({
      where: {
        id,
      },
      include: {
        artists: {
          select: {
            id: true,
            display_name: true,
            avatar_url: true,
          },
        },
      },
    });
  }
}
