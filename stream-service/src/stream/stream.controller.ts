import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StreamService } from './stream.service';
import { RecordPlayEventDto, GetPlayHistoryDto, GetTopSongsDto } from './dto';

@Controller()
export class StreamController {
  private readonly logger = new Logger(StreamController.name);

  constructor(private readonly streamService: StreamService) {}

  /**
   * Record a play event
   * Pattern: stream.record-play
   */
  @MessagePattern('stream.record-play')
  async recordPlayEvent(
    @Payload() payload: { userId: string } & RecordPlayEventDto,
  ) {
    this.logger.log(`Recording play event for user: ${payload.userId}`);
    const { userId, ...dto } = payload;
    return this.streamService.recordPlayEvent(userId, dto);
  }

  /**
   * Get user's play history
   * Pattern: stream.get-history
   */
  @MessagePattern('stream.get-history')
  async getPlayHistory(
    @Payload() payload: { userId: string } & GetPlayHistoryDto,
  ) {
    this.logger.log(`Getting play history for user: ${payload.userId}`);
    const { userId, ...dto } = payload;
    return this.streamService.getPlayHistory(userId, dto);
  }

  /**
   * Get recently played songs
   * Pattern: stream.recently-played
   */
  @MessagePattern('stream.recently-played')
  async getRecentlyPlayed(
    @Payload() payload: { userId: string; limit?: number },
  ) {
    this.logger.log(`Getting recently played for user: ${payload.userId}`);
    return this.streamService.getRecentlyPlayed(payload.userId, payload.limit);
  }

  /**
   * Get user's top songs
   * Pattern: stream.top-songs
   */
  @MessagePattern('stream.top-songs')
  async getTopSongs(@Payload() payload: { userId: string } & GetTopSongsDto) {
    this.logger.log(`Getting top songs for user: ${payload.userId}`);
    const { userId, ...dto } = payload;
    return this.streamService.getTopSongs(userId, dto);
  }

  /**
   * Get user's streaming stats
   * Pattern: stream.stats
   */
  @MessagePattern('stream.stats')
  async getStreamingStats(@Payload() payload: { userId: string }) {
    this.logger.log(`Getting streaming stats for user: ${payload.userId}`);
    return this.streamService.getStreamingStats(payload.userId);
  }

  /**
   * Get play count for a song
   * Pattern: stream.song-play-count
   */
  @MessagePattern('stream.song-play-count')
  async getSongPlayCount(@Payload() payload: { songId: string }) {
    this.logger.log(`Getting play count for song: ${payload.songId}`);
    return this.streamService.getSongPlayCount(payload.songId);
  }

  /**
   * Get global top songs (charts)
   * Pattern: stream.global-top-songs
   */
  @MessagePattern('stream.global-top-songs')
  async getGlobalTopSongs(
    @Payload() payload: { limit?: number; period?: string },
  ) {
    this.logger.log(`Getting global top songs`);
    return this.streamService.getGlobalTopSongs(payload.limit, payload.period);
  }

  /**
   * Clear user's play history
   * Pattern: stream.clear-history
   */
  @MessagePattern('stream.clear-history')
  async clearPlayHistory(@Payload() payload: { userId: string }) {
    this.logger.log(`Clearing play history for user: ${payload.userId}`);
    return this.streamService.clearPlayHistory(payload.userId);
  }
}
