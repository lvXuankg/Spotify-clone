import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateArtistDto } from './dto/create-artist.dto';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { RedisService } from 'src/redis/redis.service';
import { CACHE_KEYS, CACHE_TTL, CACHE_PATTERNS } from 'src/redis/cache-keys';

@Injectable()
export class ArtistService {
  constructor(
    @Inject('ARTIST_SERVICE') private readonly client: ClientProxy,
    private readonly redis: RedisService,
  ) {}

  async createArtist(dto: CreateArtistDto) {
    const result = await sendMicroserviceRequest(
      this.client,
      'artist.create-artist',
      dto,
    );
    // Invalidate artist list cache
    await this.redis.delByPattern(CACHE_PATTERNS.ALL_ARTISTS);
    return result;
  }

  async updateArtist(id: string, dto: UpdateArtistDto) {
    const result = await sendMicroserviceRequest(
      this.client,
      'artist.update-artist',
      { id, ...dto },
    );
    // Invalidate specific artist and list cache
    await this.redis.del(CACHE_KEYS.ARTIST(id));
    await this.redis.delByPattern(CACHE_PATTERNS.ALL_ARTISTS);
    return result;
  }

  async deleteArtist(artistId: string) {
    const result = await sendMicroserviceRequest(
      this.client,
      'artist.delete-artist',
      artistId,
    );
    // Invalidate caches
    await this.redis.del(CACHE_KEYS.ARTIST(artistId));
    await this.redis.delByPattern(CACHE_PATTERNS.ALL_ARTISTS);
    return result;
  }

  async getListArtist(page = 1, limit = 10) {
    const cacheKey = CACHE_KEYS.ARTIST_LIST(page, limit);

    // Try cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    // Fetch from service
    const result = await sendMicroserviceRequest(
      this.client,
      'artist.get-list-artist',
      { page, limit },
    );

    // Cache result
    await this.redis.set(cacheKey, result, CACHE_TTL.LIST);
    return result;
  }

  async getArtist(artistId: string) {
    const cacheKey = CACHE_KEYS.ARTIST(artistId);

    // Try cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    // Fetch from service
    const result = await sendMicroserviceRequest(
      this.client,
      'artist.get-detail-artist',
      { artistId },
    );

    // Cache result
    await this.redis.set(cacheKey, result, CACHE_TTL.MEDIUM);
    return result;
  }
}
