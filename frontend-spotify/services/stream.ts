import api from "@/lib/axios";
import type {
  RecordPlayEventDto,
  RecordPlayEventResponse,
  PlayHistory,
  PlayHistoryResponse,
  RecentlyPlayedResponse,
  TopSongsResponse,
  StreamingStats,
  SongPlayCountResponse,
  GlobalChartsResponse,
  ClearHistoryResponse,
  TopSongsPeriod,
} from "@/interfaces/stream.d";

const STREAM_URL = "/stream";

/**
 * Record a play event when user plays a song
 */
const recordPlayEvent = (dto: RecordPlayEventDto) => {
  return api.post<RecordPlayEventResponse>(`${STREAM_URL}/play`, dto);
};

/**
 * Get user's play history with pagination
 */
const getPlayHistory = (page: number = 1, limit: number = 20) => {
  return api.get<PlayHistoryResponse>(`${STREAM_URL}/history`, {
    params: { page, limit },
  });
};

/**
 * Get recently played songs (unique)
 */
const getRecentlyPlayed = (limit: number = 20) => {
  return api.get<RecentlyPlayedResponse>(`${STREAM_URL}/recently-played`, {
    params: { limit },
  });
};

/**
 * Get user's top songs by play count
 */
const getTopSongs = (limit: number = 10, period: TopSongsPeriod = "all") => {
  return api.get<TopSongsResponse>(`${STREAM_URL}/top-songs`, {
    params: { limit, period },
  });
};

/**
 * Get user's streaming stats
 */
const getStreamingStats = () => {
  return api.get<StreamingStats>(`${STREAM_URL}/stats`);
};

/**
 * Get play count for a specific song
 */
const getSongPlayCount = (songId: string) => {
  return api.get<SongPlayCountResponse>(
    `${STREAM_URL}/song/${songId}/play-count`
  );
};

/**
 * Get global top songs (charts)
 */
const getGlobalTopSongs = (
  limit: number = 50,
  period: TopSongsPeriod = "week"
) => {
  return api.get<GlobalChartsResponse>(`${STREAM_URL}/charts`, {
    params: { limit, period },
  });
};

/**
 * Clear user's play history
 */
const clearPlayHistory = () => {
  return api.delete<ClearHistoryResponse>(`${STREAM_URL}/history`);
};

export const streamService = {
  recordPlayEvent,
  getPlayHistory,
  getRecentlyPlayed,
  getTopSongs,
  getStreamingStats,
  getSongPlayCount,
  getGlobalTopSongs,
  clearPlayHistory,
};
