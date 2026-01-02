import { Inject, Injectable } from '@nestjs/common';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from 'src/redis/redis.service';
import { CACHE_KEYS, CACHE_TTL, CACHE_PATTERNS } from 'src/redis/cache-keys';

@Injectable()
export class AlbumService {
  constructor(
    @Inject('ALBUM_SERVICE') private readonly client: ClientProxy,
    private readonly redis: RedisService,
  ) {}

  async createAlbum(artistId: string, dto: CreateAlbumDto) {
    const result = await sendMicroserviceRequest(
      this.client,
      'album.create-album',
      {
        artistId,
        ...dto,
      },
    );
    // Invalidate album list cache for this artist
    await this.redis.del(CACHE_KEYS.ALBUM_LIST(artistId));
    await this.redis.delByPattern(CACHE_PATTERNS.ALL_ALBUMS);
    return result;
  }

  async updateAlbum(id: string, dto: UpdateAlbumDto) {
    const result = await sendMicroserviceRequest(
      this.client,
      'album.update-album',
      {
        id,
        ...dto,
      },
    );
    // Invalidate album cache
    await this.redis.del(CACHE_KEYS.ALBUM(id));
    await this.redis.delByPattern(CACHE_PATTERNS.ALL_ALBUMS);
    return result;
  }

  async getAlbums(artistId: string, page: number = 1, limit: number = 10) {
    const cacheKey = CACHE_KEYS.ALBUM_LIST(artistId);

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const result = await sendMicroserviceRequest(
      this.client,
      'album.get-list-album',
      {
        artistId,
        page,
        limit,
      },
    );
    await this.redis.set(cacheKey, result, CACHE_TTL.LIST);
    return result;
  }

  async getAlbum(albumId: string) {
    const cacheKey = CACHE_KEYS.ALBUM(albumId);

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const result = await sendMicroserviceRequest(
      this.client,
      'album.get-album',
      {
        id: albumId,
      },
    );
    await this.redis.set(cacheKey, result, CACHE_TTL.MEDIUM);
    return result;
  }

  async deleteAlbum(id: string) {
    // Get album first to know artistId for cache invalidation
    const album = await sendMicroserviceRequest(
      this.client,
      'album.get-album',
      {
        id,
      },
    );

    const result = await sendMicroserviceRequest(
      this.client,
      'album.delete-album',
      {
        id,
      },
    );

    // Invalidate caches
    await this.redis.del(CACHE_KEYS.ALBUM(id));
    await this.redis.del(CACHE_KEYS.ALBUM_SONGS(id));
    await this.redis.delByPattern(CACHE_PATTERNS.ALL_ALBUMS);
    if (album?.artist_id) {
      await this.redis.del(CACHE_KEYS.ALBUM_LIST(album.artist_id));
    }
    return result;
  }

  async getAllAlbums(
    page: number = 1,
    limit: number = 10,
    sortBy: 'created_at' | 'updated_at' = 'created_at',
    order: 'asc' | 'desc' = 'desc',
  ) {
    // Don't cache sorted/filtered results to keep it simple
    return sendMicroserviceRequest(this.client, 'album.get-all', {
      page,
      limit,
      sortBy,
      order,
    });
  }
}
