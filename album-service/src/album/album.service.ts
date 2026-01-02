import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { SearchClient } from '../search/search.client';

@Injectable()
export class AlbumService {
  constructor(
    private prisma: PrismaService,
    private searchClient: SearchClient,
  ) {}

  private throwNotFoundAlbumException() {
    throw new NotFoundException({ message: 'Không tìm thấy album này' });
  }

  async create(artistId: string, dto: CreateAlbumDto) {
    const album = await this.prisma.albums.create({
      data: {
        title: dto.title,
        cover_url: dto.coverUrl,
        release_date: dto.releaseDate ? new Date(dto.releaseDate) : null,
        artist_id: artistId,
        type: dto.type,
      },
    });

    // Index the album in Elasticsearch
    await this.searchClient.indexAlbum(album.id, {
      title: album.title,
      coverUrl: album.cover_url,
      releaseDate: album.release_date,
      type: 'album',
    });

    return album;
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

    const updatedAlbum = await this.prisma.albums.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.coverUrl && { cover_url: dto.coverUrl }),
        ...(dto.releaseDate && { release_date: new Date(dto.releaseDate) }),
        ...(dto.type && { type: dto.type }),
      },
    });

    // Index the updated album in Elasticsearch
    await this.searchClient.indexAlbum(updatedAlbum.id, {
      title: updatedAlbum.title,
      coverUrl: updatedAlbum.cover_url,
      releaseDate: updatedAlbum.release_date,
      type: 'album',
    });

    return updatedAlbum;
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

    // Delete the album from Elasticsearch
    await this.searchClient.deleteAlbum(id);

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

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: 'created_at' | 'updated_at' = 'created_at',
    order: 'asc' | 'desc' = 'desc',
  ) {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 50);

    const [albums, total] = await this.prisma.$transaction([
      this.prisma.albums.findMany({
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        include: {
          artists: {
            select: {
              id: true,
              display_name: true,
              avatar_url: true,
            },
          },
        },
        orderBy: {
          [sortBy]: order,
        },
      }),
      this.prisma.albums.count(),
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: albums.map((album) => ({
        id: album.id,
        title: album.title,
        cover_url: album.cover_url,
        type: album.type,
        release_date: album.release_date,
        created_at: album.created_at,
        updated_at: album.updated_at,
        artist: album.artists
          ? {
              id: album.artists.id,
              display_name: album.artists.display_name,
              avatar_url: album.artists.avatar_url,
            }
          : null,
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
