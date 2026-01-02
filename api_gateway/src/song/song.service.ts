import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSongDto } from './dto/create-song.dto';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { UpdateSongDto } from './dto/update-song.dto';
import { extractPublicIdFromUrl } from 'src/common/utils/cloudinary.util';
import { RedisService } from 'src/redis/redis.service';
import { CACHE_KEYS, CACHE_TTL, CACHE_PATTERNS } from 'src/redis/cache-keys';

@Injectable()
export class SongService {
  constructor(
    @Inject('SONG_SERVICE') private readonly client: ClientProxy,
    @Inject('FILE_SERVICE') private readonly file: ClientProxy,
    private readonly redis: RedisService,
  ) {}

  async createSong(albumId: string, dto: CreateSongDto) {
    const result = await sendMicroserviceRequest(this.client, 'song.create', {
      albumId,
      ...dto,
    });
    // Invalidate caches
    await this.redis.delByPattern(CACHE_PATTERNS.ALL_SONGS);
    await this.redis.del(CACHE_KEYS.ALBUM_SONGS(albumId));
    return result;
  }

  async updateSong(songId: string, dto: UpdateSongDto) {
    // Get song first to know albumId for cache invalidation
    const song = await sendMicroserviceRequest(this.client, 'song.findOne', {
      id: songId,
    });

    const result = await sendMicroserviceRequest(this.client, 'song.update', {
      id: songId,
      ...dto,
    });

    // Invalidate caches
    await this.redis.del(CACHE_KEYS.SONG(songId));
    await this.redis.delByPattern(CACHE_PATTERNS.ALL_SONGS);
    // Also invalidate album songs cache
    if (song?.album_id) {
      await this.redis.del(CACHE_KEYS.ALBUM_SONGS(song.album_id));
    }
    return result;
  }

  async findAllSongs(albumId: string) {
    const cacheKey = CACHE_KEYS.ALBUM_SONGS(albumId);

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const result = await sendMicroserviceRequest(this.client, 'song.findAll', {
      albumId,
    });
    await this.redis.set(cacheKey, result, CACHE_TTL.LIST);
    return result;
  }

  async getAllSongs(page = 1, limit = 10, search?: string) {
    // Don't cache search results with search term (too many variations)
    if (search) {
      return sendMicroserviceRequest(this.client, 'song.getAllSongs', {
        page,
        limit,
        search,
      });
    }

    const cacheKey = CACHE_KEYS.SONG_LIST(page, limit);
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const result = await sendMicroserviceRequest(
      this.client,
      'song.getAllSongs',
      { page, limit, search },
    );
    await this.redis.set(cacheKey, result, CACHE_TTL.LIST);
    return result;
  }

  async getSong(songId: string) {
    const cacheKey = CACHE_KEYS.SONG(songId);

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const result = await sendMicroserviceRequest(this.client, 'song.findOne', {
      id: songId,
    });
    await this.redis.set(cacheKey, result, CACHE_TTL.MEDIUM);
    return result;
  }

  async deleteSong(songId: string) {
    const song = await sendMicroserviceRequest(this.client, 'song.findOne', {
      id: songId,
    });

    if (!song) {
      throw new Error('Không tìm thấy bài hát');
    }

    if (song.audio_url) {
      const publicId = extractPublicIdFromUrl(song.audio_url);

      if (publicId) {
        try {
          await sendMicroserviceRequest(this.file, 'file.delete', {
            publicId,
          });
        } catch (err) {
          console.error('Không xóa được file Cloudinary:', err);
        }
      }
    }

    const deletedSong = await sendMicroserviceRequest(
      this.client,
      'song.delete',
      { id: songId },
    );

    // Invalidate caches
    await this.redis.del(CACHE_KEYS.SONG(songId));
    await this.redis.delByPattern(CACHE_PATTERNS.ALL_SONGS);
    // Also invalidate album songs cache if song has albumId
    if (song.album_id) {
      await this.redis.del(CACHE_KEYS.ALBUM_SONGS(song.album_id));
    }

    return deletedSong;
  }

  async incrementPlayCount(songId: string) {
    const result = await sendMicroserviceRequest(
      this.client,
      'song.incrementPlayCount',
      { id: songId },
    );
    // Invalidate song cache to reflect new play count
    await this.redis.del(CACHE_KEYS.SONG(songId));
    return result;
  }

  async searchSongByTitle(keyword: string, page: number, limit: number) {
    const cacheKey = CACHE_KEYS.SEARCH(keyword, 'song');

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const result = await sendMicroserviceRequest(
      this.client,
      'song.search-by-title',
      { keyword, page, limit },
    );
    await this.redis.set(cacheKey, result, CACHE_TTL.SEARCH);
    return result;
  }
}
