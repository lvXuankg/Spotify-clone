import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StreamService } from './stream.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RecordPlayEventDto, GetPlayHistoryDto, GetTopSongsDto } from './dto';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  /**
   * Record a play event
   * POST /stream/play
   */
  @Post('play')
  @UseGuards(JwtAuthGuard)
  async recordPlayEvent(@Request() req: any, @Body() dto: RecordPlayEventDto) {
    return this.streamService.recordPlayEvent(req.user.userId, dto);
  }

  /**
   * Get user's play history
   * GET /stream/history
   */
  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getPlayHistory(@Request() req: any, @Query() dto: GetPlayHistoryDto) {
    return this.streamService.getPlayHistory(req.user.userId, dto);
  }

  /**
   * Get recently played songs
   * GET /stream/recently-played
   */
  @Get('recently-played')
  @UseGuards(JwtAuthGuard)
  async getRecentlyPlayed(@Request() req: any, @Query('limit') limit?: number) {
    return this.streamService.getRecentlyPlayed(req.user.userId, limit);
  }

  /**
   * Get user's top songs
   * GET /stream/top-songs
   */
  @Get('top-songs')
  @UseGuards(JwtAuthGuard)
  async getTopSongs(@Request() req: any, @Query() dto: GetTopSongsDto) {
    return this.streamService.getTopSongs(req.user.userId, dto);
  }

  /**
   * Get user's streaming stats
   * GET /stream/stats
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStreamingStats(@Request() req: any) {
    return this.streamService.getStreamingStats(req.user.userId);
  }

  /**
   * Get play count for a song
   * GET /stream/song/:songId/play-count
   */
  @Get('song/:songId/play-count')
  async getSongPlayCount(@Param('songId') songId: string) {
    return this.streamService.getSongPlayCount(songId);
  }

  /**
   * Get global top songs (charts)
   * GET /stream/charts
   */
  @Get('charts')
  async getGlobalTopSongs(
    @Query('limit') limit?: number,
    @Query('period') period?: string,
  ) {
    return this.streamService.getGlobalTopSongs(limit, period);
  }

  /**
   * Clear user's play history
   * DELETE /stream/history
   */
  @Delete('history')
  @UseGuards(JwtAuthGuard)
  async clearPlayHistory(@Request() req: any) {
    return this.streamService.clearPlayHistory(req.user.userId);
  }
}
