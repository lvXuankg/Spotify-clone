/**
 * Redis Cache Keys & TTL Configuration
 * Centralized cache key management for production-grade caching
 */

export const CACHE_KEYS = {
  // Artist cache
  ARTIST: (id: string) => `artist:${id}`,
  ARTIST_LIST: (page: number, limit: number) => `artist:list:${page}:${limit}`,
  ARTIST_SEARCH: (query: string, page: number) =>
    `artist:search:${query}:${page}`,

  // Album cache
  ALBUM: (id: string) => `album:${id}`,
  ALBUM_LIST: (artistId: string) => `album:list:${artistId}`,
  ALBUM_SONGS: (albumId: string) => `album:songs:${albumId}`,

  // Song cache
  SONG: (id: string) => `song:${id}`,
  SONG_LIST: (page: number, limit: number) => `song:list:${page}:${limit}`,

  // Playlist cache
  PLAYLIST: (id: string) => `playlist:${id}`,
  PLAYLIST_PUBLIC: (page: number, limit: number) =>
    `playlist:public:${page}:${limit}`,
  USER_PLAYLISTS: (userId: string) => `playlist:user:${userId}`,

  // User cache
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,

  // Search cache
  SEARCH: (query: string, type: string) => `search:${type}:${query}`,

  // Stats cache
  DASHBOARD_STATS: 'admin:dashboard:stats',
} as const;

/**
 * Cache TTL in seconds
 */
export const CACHE_TTL = {
  // Short-lived cache (1-5 minutes)
  SHORT: 60, // 1 minute
  SEARCH: 120, // 2 minutes

  // Medium cache (5-30 minutes)
  MEDIUM: 300, // 5 minutes
  LIST: 180, // 3 minutes

  // Long-lived cache (1-24 hours)
  LONG: 3600, // 1 hour
  STATIC: 86400, // 24 hours

  // User-specific cache
  USER_PROFILE: 600, // 10 minutes
  USER_PLAYLISTS: 300, // 5 minutes

  // Admin dashboard
  DASHBOARD: 60, // 1 minute (frequently updated)
} as const;

/**
 * Cache invalidation patterns
 */
export const CACHE_PATTERNS = {
  ALL_ARTISTS: 'artist:*',
  ALL_ALBUMS: 'album:*',
  ALL_SONGS: 'song:*',
  ALL_PLAYLISTS: 'playlist:*',
  ALL_SEARCH: 'search:*',
  USER_DATA: (userId: string) => `*:user:${userId}*`,
} as const;
