import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkIfBelongUser(userId: string, playlistId: string) {
    const playlist = await this.prisma.playlists.findUnique({
      where: {
        id: playlistId,
      },
      select: {
        user_id: true,
      },
    });

    if (!playlist) {
      throw new NotFoundException({ message: 'Không tìm thấy playlist' });
    }

    if (playlist.user_id !== userId) {
      throw new ForbiddenException(
        'Bạn không có quyền thao tác với playlist này',
      );
    }
  }

  async create(userId: string, dto: CreatePlaylistDto) {
    return this.prisma.playlists.create({
      data: {
        title: dto.title,
        user_id: userId,
        ...(dto.description && { description: dto.description }),
        ...(dto.coverUrl && { cover_url: dto.coverUrl }),
        ...(dto.isPublic !== undefined && { is_public: dto.isPublic }),
      },
    });
  }

  async update(userId: string, playlistId: string, dto: UpdatePlaylistDto) {
    await this.checkIfBelongUser(userId, playlistId);

    return this.prisma.playlists.update({
      where: {
        id: playlistId,
      },
      data: {
        ...(dto.coverUrl !== undefined && { cover_url: dto.coverUrl }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isPublic !== undefined && { is_public: dto.isPublic }),
        ...(dto.title !== undefined && { title: dto.title }),
      },
    });
  }

  async delete(playlistId: string, userId?: string) {
    if (userId) {
      await this.checkIfBelongUser(userId, playlistId);
    }

    return this.prisma.playlists.delete({
      where: {
        id: playlistId,
      },
    });
  }

  async addSongToPlaylist(userId: string, playlistId: string, songId: string) {
    await this.checkIfBelongUser(userId, playlistId);

    return this.prisma.$transaction(async (tx) => {
      const maxPosition = await tx.playlist_songs.aggregate({
        where: { playlist_id: playlistId },
        _max: { position: true },
      });

      const nextPosition = (maxPosition._max.position ?? 0) + 1;

      return tx.playlist_songs.create({
        data: {
          playlist_id: playlistId,
          song_id: songId,
          added_by: userId,
          position: nextPosition,
        },
      });
    });
  }

  async getOnePlaylist(userId: string, playlistId: string) {
    const playlist = await this.prisma.playlists.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new NotFoundException('Không tìm thấy playlist');
    }

    if (!playlist.is_public && userId !== playlist.user_id) {
      throw new ForbiddenException('Playlist được cài đặt riêng tư');
    }

    const playlistSongs = await this.prisma.playlist_songs.findMany({
      where: { playlist_id: playlistId },
      orderBy: { position: 'asc' },
      include: {
        songs: {
          include: {
            song_artists: {
              include: { artists: true },
            },
          },
        },
      },
    });

    return {
      id: playlist.id,
      user_id: playlist.user_id,
      title: playlist.title,
      description: playlist.description,
      cover_url: playlist.cover_url,
      is_public: playlist.is_public,
      created_at: playlist.created_at,
      updated_at: playlist.updated_at,
      songs: playlistSongs
        .filter((ps) => ps.songs !== null)
        .map((ps) => ({
          id: ps.songs!.id,
          title: ps.songs!.title,
          duration: ps.songs!.duration_seconds,
          audio_url: ps.songs!.audio_url,
          position: ps.position,
          artists: ps
            .songs!.song_artists.filter((sa) => sa.artists !== null)
            .map((sa) => ({
              id: sa.artists!.id,
              display_name: sa.artists!.display_name,
              avatar_url: sa.artists!.avatar_url,
            })),
        })),
    };
  }

  async getMyPlaylists(userId: string) {
    const playlists = await this.prisma.playlists.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        updated_at: 'desc',
      },
      select: {
        id: true,
        title: true,
        cover_url: true,
        is_public: true,
        updated_at: true,
        _count: {
          select: {
            playlist_songs: true,
          },
        },
      },
    });

    return playlists.map((pl) => ({
      id: pl.id,
      title: pl.title,
      cover_url: pl.cover_url,
      is_public: pl.is_public,
      song_count: pl._count.playlist_songs,
      updated_at: pl.updated_at,
    }));
  }
}
