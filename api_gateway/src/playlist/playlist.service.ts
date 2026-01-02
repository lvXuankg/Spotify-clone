import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { RedisService } from 'src/redis/redis.service';
import { CACHE_KEYS, CACHE_TTL, CACHE_PATTERNS } from 'src/redis/cache-keys';

@Injectable()
export class PlaylistService {
  constructor(
    @Inject('PLAYLIST_SERVICE') private readonly client: ClientProxy,
    private readonly redis: RedisService,
  ) {}

  async createPlaylist(userId: string, dto: CreatePlaylistDto) {
    const result = await sendMicroserviceRequest(
      this.client,
      'playlist.create',
      {
        userId,
        ...dto,
      },
    );
    // Invalidate user playlists cache
    await this.redis.del(CACHE_KEYS.USER_PLAYLISTS(userId));
    await this.redis.delByPattern(CACHE_PATTERNS.ALL_PLAYLISTS);
    return result;
  }

  async updatePlaylist(
    userId: string,
    playlistId: string,
    dto: UpdatePlaylistDto,
  ) {
    const result = await sendMicroserviceRequest(
      this.client,
      'playlist.update',
      {
        userId,
        playlistId,
        ...dto,
      },
    );
    await this.redis.del(CACHE_KEYS.PLAYLIST(playlistId));
    await this.redis.del(CACHE_KEYS.USER_PLAYLISTS(userId));
    await this.redis.delByPattern(CACHE_PATTERNS.ALL_PLAYLISTS);
    return result;
  }

  async deletePlaylist(userId: string, playlistId: string) {
    const result = await sendMicroserviceRequest(
      this.client,
      'playlist.delete',
      {
        userId,
        playlistId,
      },
    );
    await this.redis.del(CACHE_KEYS.PLAYLIST(playlistId));
    await this.redis.del(CACHE_KEYS.USER_PLAYLISTS(userId));
    await this.redis.delByPattern(CACHE_PATTERNS.ALL_PLAYLISTS);
    return result;
  }

  async addSongToPlaylist(userId: string, playlistId: string, songId: string) {
    const result = await sendMicroserviceRequest(
      this.client,
      'playlist.add-song',
      {
        userId,
        playlistId,
        songId,
      },
    );
    await this.redis.del(CACHE_KEYS.PLAYLIST(playlistId));
    return result;
  }

  async removeSongFromPlaylist(
    userId: string,
    playlistId: string,
    songId: string,
  ) {
    const result = await sendMicroserviceRequest(
      this.client,
      'playlist.remove-song',
      {
        userId,
        playlistId,
        songId,
      },
    );
    await this.redis.del(CACHE_KEYS.PLAYLIST(playlistId));
    return result;
  }

  async getPlaylistDetail(userId: string, playlistId: string) {
    const cacheKey = CACHE_KEYS.PLAYLIST(playlistId);

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const result = await sendMicroserviceRequest(
      this.client,
      'playlist.get-detail',
      {
        userId,
        playlistId,
      },
    );
    await this.redis.set(cacheKey, result, CACHE_TTL.MEDIUM);
    return result;
  }

  async getMyPlaylists(userId: string) {
    const cacheKey = CACHE_KEYS.USER_PLAYLISTS(userId);

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const result = await sendMicroserviceRequest(
      this.client,
      'playlist.get-my-playlist',
      {
        userId,
      },
    );
    await this.redis.set(cacheKey, result, CACHE_TTL.USER_PLAYLISTS);
    return result;
  }

  async getPublicPlaylists(
    page: number = 1,
    limit: number = 10,
    sortBy: 'created_at' | 'updated_at' = 'created_at',
    order: 'asc' | 'desc' = 'desc',
  ) {
    const cacheKey = CACHE_KEYS.PLAYLIST_PUBLIC(page, limit);

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const result = await sendMicroserviceRequest(
      this.client,
      'playlist.get-public',
      {
        page,
        limit,
        sortBy,
        order,
      },
    );
    await this.redis.set(cacheKey, result, CACHE_TTL.LIST);
    return result;
  }
}
