import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecordPlayEventDto, GetPlayHistoryDto, GetTopSongsDto } from './dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class StreamService {
  private readonly logger = new Logger(StreamService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Record a play event when user plays a song
   */
  async recordPlayEvent(userId: string, dto: RecordPlayEventDto) {
    const { songId, playedSeconds } = dto;

    try {
      // Create play event record
      const playEvent = await this.prisma.song_play_events.create({
        data: {
          user_id: userId,
          song_id: songId,
          played_seconds: playedSeconds,
        },
      });

      // Also record in play history for quick access
      await this.prisma.song_play_history.create({
        data: {
          user_id: userId,
          song_id: songId,
        },
      });

      this.logger.log(
        `Recorded play event for user ${userId}, song ${songId}, duration ${playedSeconds}s`,
      );

      return {
        success: true,
        data: playEvent,
      };
    } catch (error) {
      this.logger.error(`Error recording play event: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to record play event',
      });
    }
  }

  /**
   * Get play history for a user
   */
  async getPlayHistory(userId: string, dto: GetPlayHistoryDto) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    try {
      const [history, total] = await Promise.all([
        this.prisma.song_play_history.findMany({
          where: { user_id: userId },
          orderBy: { played_at: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.song_play_history.count({
          where: { user_id: userId },
        }),
      ]);

      return {
        data: history,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error getting play history: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to get play history',
      });
    }
  }

  /**
   * Get recently played songs (unique songs)
   */
  async getRecentlyPlayed(userId: string, limit: number = 20) {
    try {
      const recentSongs = await this.prisma.song_play_history.findMany({
        where: { user_id: userId },
        orderBy: { played_at: 'desc' },
        distinct: ['song_id'],
        take: limit,
      });

      return {
        data: recentSongs,
      };
    } catch (error) {
      this.logger.error(`Error getting recently played: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to get recently played',
      });
    }
  }

  /**
   * Get top songs for a user based on play count
   */
  async getTopSongs(userId: string, dto: GetTopSongsDto) {
    const { limit = 10, period = 'all' } = dto;

    try {
      // Calculate date filter based on period
      let dateFilter: Date | undefined;
      const now = new Date();

      switch (period) {
        case 'day':
          dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateFilter = undefined;
      }

      // Group by song_id and count plays
      const topSongs = await this.prisma.song_play_events.groupBy({
        by: ['song_id'],
        where: {
          user_id: userId,
          ...(dateFilter && { created_at: { gte: dateFilter } }),
        },
        _count: {
          song_id: true,
        },
        _sum: {
          played_seconds: true,
        },
        orderBy: {
          _count: {
            song_id: 'desc',
          },
        },
        take: limit,
      });

      return {
        data: topSongs.map((item) => ({
          songId: item.song_id,
          playCount: item._count.song_id,
          totalPlayedSeconds: item._sum.played_seconds || 0,
        })),
        period,
      };
    } catch (error) {
      this.logger.error(`Error getting top songs: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to get top songs',
      });
    }
  }

  /**
   * Get streaming stats for a user
   */
  async getStreamingStats(userId: string) {
    try {
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));

      const [totalPlays, totalDuration, uniqueSongs, todayPlays] =
        await Promise.all([
          // Total play count
          this.prisma.song_play_events.count({
            where: { user_id: userId },
          }),

          // Total listening duration
          this.prisma.song_play_events.aggregate({
            where: { user_id: userId },
            _sum: { played_seconds: true },
          }),

          // Unique songs played
          this.prisma.song_play_events.groupBy({
            by: ['song_id'],
            where: { user_id: userId },
          }),

          // Today's plays
          this.prisma.song_play_events.count({
            where: {
              user_id: userId,
              created_at: { gte: todayStart },
            },
          }),
        ]);

      const totalSeconds = totalDuration._sum.played_seconds || 0;

      return {
        totalPlays,
        totalListeningTimeSeconds: totalSeconds,
        totalListeningTimeMinutes: Math.round(totalSeconds / 60),
        totalListeningTimeHours: Math.round(totalSeconds / 3600),
        uniqueSongsPlayed: uniqueSongs.length,
        todayPlays,
      };
    } catch (error) {
      this.logger.error(`Error getting streaming stats: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to get streaming stats',
      });
    }
  }

  /**
   * Get play count for a specific song
   */
  async getSongPlayCount(songId: string) {
    try {
      const playCount = await this.prisma.song_play_events.count({
        where: { song_id: songId },
      });

      // Get today's snapshot if exists
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const snapshot = await this.prisma.song_play_counts.findUnique({
        where: {
          song_id_snapshot_date: {
            song_id: songId,
            snapshot_date: today,
          },
        },
      });

      return {
        songId,
        totalPlayCount: snapshot?.total_play_count
          ? Number(snapshot.total_play_count)
          : playCount,
        recentPlayCount: playCount,
      };
    } catch (error) {
      this.logger.error(`Error getting song play count: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to get song play count',
      });
    }
  }

  /**
   * Get top songs globally (for charts/trending)
   */
  async getGlobalTopSongs(limit: number = 50, period: string = 'week') {
    try {
      let dateFilter: Date | undefined;
      const now = new Date();

      switch (period) {
        case 'day':
          dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateFilter = undefined;
      }

      const topSongs = await this.prisma.song_play_events.groupBy({
        by: ['song_id'],
        where: dateFilter ? { created_at: { gte: dateFilter } } : undefined,
        _count: {
          song_id: true,
        },
        orderBy: {
          _count: {
            song_id: 'desc',
          },
        },
        take: limit,
      });

      return {
        data: topSongs.map((item, index) => ({
          rank: index + 1,
          songId: item.song_id,
          playCount: item._count.song_id,
        })),
        period,
      };
    } catch (error) {
      this.logger.error(`Error getting global top songs: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to get global top songs',
      });
    }
  }

  /**
   * Clear play history for a user
   */
  async clearPlayHistory(userId: string) {
    try {
      const deleted = await this.prisma.song_play_history.deleteMany({
        where: { user_id: userId },
      });

      return {
        success: true,
        deletedCount: deleted.count,
      };
    } catch (error) {
      this.logger.error(`Error clearing play history: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to clear play history',
      });
    }
  }
}
