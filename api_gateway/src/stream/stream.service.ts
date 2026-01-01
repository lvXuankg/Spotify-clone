import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { RecordPlayEventDto, GetPlayHistoryDto, GetTopSongsDto } from './dto';

@Injectable()
export class StreamService {
  constructor(@Inject('STREAM_SERVICE') private readonly client: ClientProxy) {}

  /**
   * Record a play event
   */
  async recordPlayEvent(userId: string, dto: RecordPlayEventDto) {
    return sendMicroserviceRequest(this.client, 'stream.record-play', {
      userId,
      ...dto,
    });
  }

  /**
   * Get user's play history
   */
  async getPlayHistory(userId: string, dto: GetPlayHistoryDto) {
    return sendMicroserviceRequest(this.client, 'stream.get-history', {
      userId,
      ...dto,
    });
  }

  /**
   * Get recently played songs
   */
  async getRecentlyPlayed(userId: string, limit?: number) {
    return sendMicroserviceRequest(this.client, 'stream.recently-played', {
      userId,
      limit,
    });
  }

  /**
   * Get user's top songs
   */
  async getTopSongs(userId: string, dto: GetTopSongsDto) {
    return sendMicroserviceRequest(this.client, 'stream.top-songs', {
      userId,
      ...dto,
    });
  }

  /**
   * Get user's streaming stats
   */
  async getStreamingStats(userId: string) {
    return sendMicroserviceRequest(this.client, 'stream.stats', {
      userId,
    });
  }

  /**
   * Get play count for a song
   */
  async getSongPlayCount(songId: string) {
    return sendMicroserviceRequest(this.client, 'stream.song-play-count', {
      songId,
    });
  }

  /**
   * Get global top songs (charts)
   */
  async getGlobalTopSongs(limit?: number, period?: string) {
    return sendMicroserviceRequest(this.client, 'stream.global-top-songs', {
      limit,
      period,
    });
  }

  /**
   * Clear user's play history
   */
  async clearPlayHistory(userId: string) {
    return sendMicroserviceRequest(this.client, 'stream.clear-history', {
      userId,
    });
  }
}
