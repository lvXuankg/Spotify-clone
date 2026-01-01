import { PaginationMeta } from "./pagination";

// ==================== Play Event ====================

/**
 * Record phát nhạc - song_play_events
 */
export interface PlayEvent {
  id: string;
  user_id: string;
  song_id: string;
  played_seconds: number;
  created_at: string;
}

/**
 * DTO để ghi nhận play event
 */
export interface RecordPlayEventDto {
  songId: string;
  playedSeconds: number;
}

/**
 * Response khi ghi nhận play event thành công
 */
export interface RecordPlayEventResponse {
  success: boolean;
  data: PlayEvent;
}

// ==================== Play History ====================

/**
 * Lịch sử nghe nhạc - song_play_history
 */
export interface PlayHistory {
  id: string;
  user_id: string;
  song_id: string;
  played_at: string;
}

/**
 * Query params cho play history
 */
export interface GetPlayHistoryParams {
  page?: number;
  limit?: number;
}

/**
 * Response cho play history với pagination
 */
export interface PlayHistoryResponse {
  data: PlayHistory[];
  pagination: PaginationMeta;
}

// ==================== Recently Played ====================

/**
 * Query params cho recently played
 */
export interface GetRecentlyPlayedParams {
  limit?: number;
}

/**
 * Response cho recently played
 */
export interface RecentlyPlayedResponse {
  data: PlayHistory[];
}

// ==================== Top Songs ====================

/**
 * Top song item - bài hát được nghe nhiều nhất
 */
export interface TopSongItem {
  songId: string;
  playCount: number;
  totalPlayedSeconds: number;
}

/**
 * Period filter cho top songs
 */
export type TopSongsPeriod = "day" | "week" | "month" | "all";

/**
 * Query params cho top songs
 */
export interface GetTopSongsParams {
  limit?: number;
  period?: TopSongsPeriod;
}

/**
 * Response cho top songs
 */
export interface TopSongsResponse {
  data: TopSongItem[];
  period: TopSongsPeriod;
}

// ==================== Streaming Stats ====================

/**
 * Thống kê streaming của user
 */
export interface StreamingStats {
  /** Tổng số lần phát */
  totalPlays: number;
  /** Tổng thời gian nghe (giây) */
  totalListeningTimeSeconds: number;
  /** Tổng thời gian nghe (phút) */
  totalListeningTimeMinutes: number;
  /** Tổng thời gian nghe (giờ) */
  totalListeningTimeHours: number;
  /** Số bài hát unique đã nghe */
  uniqueSongsPlayed: number;
  /** Số lần phát hôm nay */
  todayPlays: number;
}

// ==================== Song Play Count ====================

/**
 * Query params cho song play count
 */
export interface GetSongPlayCountParams {
  songId: string;
}

/**
 * Response cho song play count
 */
export interface SongPlayCountResponse {
  songId: string;
  /** Tổng số lần phát của bài hát */
  totalPlayCount: number;
  /** Số lần phát gần đây */
  recentPlayCount: number;
}

// ==================== Global Charts ====================

/**
 * Chart item - bài hát trên bảng xếp hạng
 */
export interface ChartSongItem {
  /** Vị trí trên bảng xếp hạng */
  rank: number;
  songId: string;
  playCount: number;
}

/**
 * Query params cho global charts
 */
export interface GetGlobalChartsParams {
  limit?: number;
  period?: TopSongsPeriod;
}

/**
 * Response cho global charts
 */
export interface GlobalChartsResponse {
  data: ChartSongItem[];
  period: TopSongsPeriod;
}

// ==================== Clear History ====================

/**
 * Response khi xóa lịch sử nghe nhạc
 */
export interface ClearHistoryResponse {
  success: boolean;
  deletedCount: number;
}

// ==================== User Actions ====================

/**
 * Loại action của user với song/artist/playlist
 */
export type UserActionType =
  | "like"
  | "unlike"
  | "save"
  | "unsave"
  | "play"
  | "share"
  | "follow"
  | "unfollow";

/**
 * User action với song - user_song_actions
 */
export interface UserSongAction {
  id: string;
  user_id: string;
  song_id: string;
  action_type: UserActionType;
  metadata?: Record<string, unknown>;
  created_at: string;
}

/**
 * User action với artist - user_artist_actions
 */
export interface UserArtistAction {
  id: string;
  user_id: string;
  artist_id: string;
  action_type: UserActionType;
  metadata?: Record<string, unknown>;
  created_at: string;
}

/**
 * User action với playlist - user_playlist_actions
 */
export interface UserPlaylistAction {
  id: string;
  user_id: string;
  playlist_id: string;
  action_type: UserActionType;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ==================== Song Play Counts Snapshot ====================

/**
 * Snapshot play count của bài hát - song_play_counts
 */
export interface SongPlayCountSnapshot {
  id: string;
  song_id: string;
  snapshot_date: string;
  total_play_count: number;
  created_at: string;
}
