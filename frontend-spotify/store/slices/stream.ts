import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { streamService } from "@/services/stream";
import type {
  PlayHistory,
  TopSongItem,
  StreamingStats,
  ChartSongItem,
  TopSongsPeriod,
  SongPlayCountResponse,
} from "@/interfaces/stream.d";
import type { PaginationMeta } from "@/interfaces/pagination.d";
import type { RootState } from "../store";

// ===================== Types =====================
interface StreamState {
  // Play History
  playHistory: PlayHistory[];
  playHistoryLoading: boolean;
  playHistoryError: string | null;
  playHistoryPagination: PaginationMeta;

  // Recently Played
  recentlyPlayed: PlayHistory[];
  recentlyPlayedLoading: boolean;
  recentlyPlayedError: string | null;

  // Top Songs (user's)
  topSongs: TopSongItem[];
  topSongsLoading: boolean;
  topSongsError: string | null;
  topSongsPeriod: TopSongsPeriod;

  // Streaming Stats
  streamingStats: StreamingStats | null;
  streamingStatsLoading: boolean;
  streamingStatsError: string | null;

  // Global Charts
  globalCharts: ChartSongItem[];
  globalChartsLoading: boolean;
  globalChartsError: string | null;
  globalChartsPeriod: TopSongsPeriod;

  // Song Play Count Cache
  songPlayCounts: Record<string, SongPlayCountResponse>;

  // Recording state
  isRecording: boolean;
  lastRecordedSongId: string | null;
}

const initialState: StreamState = {
  // Play History
  playHistory: [],
  playHistoryLoading: false,
  playHistoryError: null,
  playHistoryPagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasMore: false,
  },

  // Recently Played
  recentlyPlayed: [],
  recentlyPlayedLoading: false,
  recentlyPlayedError: null,

  // Top Songs
  topSongs: [],
  topSongsLoading: false,
  topSongsError: null,
  topSongsPeriod: "all",

  // Streaming Stats
  streamingStats: null,
  streamingStatsLoading: false,
  streamingStatsError: null,

  // Global Charts
  globalCharts: [],
  globalChartsLoading: false,
  globalChartsError: null,
  globalChartsPeriod: "week",

  // Song Play Count Cache
  songPlayCounts: {},

  // Recording state
  isRecording: false,
  lastRecordedSongId: null,
};

// ===================== Async Thunks =====================

/**
 * Record play event khi user nghe nhạc
 */
export const recordPlayEvent = createAsyncThunk(
  "stream/recordPlayEvent",
  async (
    payload: { songId: string; playedSeconds: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await streamService.recordPlayEvent(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to record play event"
      );
    }
  }
);

/**
 * Fetch play history với pagination
 */
export const fetchPlayHistory = createAsyncThunk(
  "stream/fetchPlayHistory",
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const { page = 1, limit = 20 } = params;
      const response = await streamService.getPlayHistory(page, limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch play history"
      );
    }
  }
);

/**
 * Fetch recently played songs
 */
export const fetchRecentlyPlayed = createAsyncThunk(
  "stream/fetchRecentlyPlayed",
  async (limit: number = 20, { rejectWithValue }) => {
    try {
      const response = await streamService.getRecentlyPlayed(limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recently played"
      );
    }
  }
);

/**
 * Fetch user's top songs
 */
export const fetchTopSongs = createAsyncThunk(
  "stream/fetchTopSongs",
  async (
    params: { limit?: number; period?: TopSongsPeriod } = {},
    { rejectWithValue }
  ) => {
    try {
      const { limit = 10, period = "all" } = params;
      const response = await streamService.getTopSongs(limit, period);
      return { data: response.data.data, period };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top songs"
      );
    }
  }
);

/**
 * Fetch streaming stats
 */
export const fetchStreamingStats = createAsyncThunk(
  "stream/fetchStreamingStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await streamService.getStreamingStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch streaming stats"
      );
    }
  }
);

/**
 * Fetch song play count
 */
export const fetchSongPlayCount = createAsyncThunk(
  "stream/fetchSongPlayCount",
  async (songId: string, { rejectWithValue }) => {
    try {
      const response = await streamService.getSongPlayCount(songId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch song play count"
      );
    }
  }
);

/**
 * Fetch global charts
 */
export const fetchGlobalCharts = createAsyncThunk(
  "stream/fetchGlobalCharts",
  async (
    params: { limit?: number; period?: TopSongsPeriod } = {},
    { rejectWithValue }
  ) => {
    try {
      const { limit = 50, period = "week" } = params;
      const response = await streamService.getGlobalTopSongs(limit, period);
      return { data: response.data.data, period };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch global charts"
      );
    }
  }
);

/**
 * Clear play history
 */
export const clearPlayHistory = createAsyncThunk(
  "stream/clearPlayHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await streamService.clearPlayHistory();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear play history"
      );
    }
  }
);

// ===================== Slice =====================
const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
    // Set period filters
    setTopSongsPeriod: (state, action: PayloadAction<TopSongsPeriod>) => {
      state.topSongsPeriod = action.payload;
    },
    setGlobalChartsPeriod: (state, action: PayloadAction<TopSongsPeriod>) => {
      state.globalChartsPeriod = action.payload;
    },
    // Clear errors
    clearPlayHistoryError: (state) => {
      state.playHistoryError = null;
    },
    clearRecentlyPlayedError: (state) => {
      state.recentlyPlayedError = null;
    },
    clearTopSongsError: (state) => {
      state.topSongsError = null;
    },
    clearStreamingStatsError: (state) => {
      state.streamingStatsError = null;
    },
    clearGlobalChartsError: (state) => {
      state.globalChartsError = null;
    },
    // Reset state
    resetStreamState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ==================== Record Play Event ====================
      .addCase(recordPlayEvent.pending, (state) => {
        state.isRecording = true;
      })
      .addCase(recordPlayEvent.fulfilled, (state, action) => {
        state.isRecording = false;
        state.lastRecordedSongId = action.meta.arg.songId;
      })
      .addCase(recordPlayEvent.rejected, (state) => {
        state.isRecording = false;
      })

      // ==================== Play History ====================
      .addCase(fetchPlayHistory.pending, (state) => {
        state.playHistoryLoading = true;
        state.playHistoryError = null;
      })
      .addCase(fetchPlayHistory.fulfilled, (state, action) => {
        state.playHistoryLoading = false;
        state.playHistory = action.payload.data;
        const { page, limit, total, totalPages } = action.payload.pagination;
        state.playHistoryPagination = {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        };
      })
      .addCase(fetchPlayHistory.rejected, (state, action) => {
        state.playHistoryLoading = false;
        state.playHistoryError = action.payload as string;
      })

      // ==================== Recently Played ====================
      .addCase(fetchRecentlyPlayed.pending, (state) => {
        state.recentlyPlayedLoading = true;
        state.recentlyPlayedError = null;
      })
      .addCase(fetchRecentlyPlayed.fulfilled, (state, action) => {
        state.recentlyPlayedLoading = false;
        state.recentlyPlayed = action.payload.data;
      })
      .addCase(fetchRecentlyPlayed.rejected, (state, action) => {
        state.recentlyPlayedLoading = false;
        state.recentlyPlayedError = action.payload as string;
      })

      // ==================== Top Songs ====================
      .addCase(fetchTopSongs.pending, (state) => {
        state.topSongsLoading = true;
        state.topSongsError = null;
      })
      .addCase(fetchTopSongs.fulfilled, (state, action) => {
        state.topSongsLoading = false;
        state.topSongs = action.payload.data;
        state.topSongsPeriod = action.payload.period as TopSongsPeriod;
      })
      .addCase(fetchTopSongs.rejected, (state, action) => {
        state.topSongsLoading = false;
        state.topSongsError = action.payload as string;
      })

      // ==================== Streaming Stats ====================
      .addCase(fetchStreamingStats.pending, (state) => {
        state.streamingStatsLoading = true;
        state.streamingStatsError = null;
      })
      .addCase(fetchStreamingStats.fulfilled, (state, action) => {
        state.streamingStatsLoading = false;
        state.streamingStats = action.payload;
      })
      .addCase(fetchStreamingStats.rejected, (state, action) => {
        state.streamingStatsLoading = false;
        state.streamingStatsError = action.payload as string;
      })

      // ==================== Song Play Count ====================
      .addCase(fetchSongPlayCount.fulfilled, (state, action) => {
        state.songPlayCounts[action.payload.songId] = action.payload;
      })

      // ==================== Global Charts ====================
      .addCase(fetchGlobalCharts.pending, (state) => {
        state.globalChartsLoading = true;
        state.globalChartsError = null;
      })
      .addCase(fetchGlobalCharts.fulfilled, (state, action) => {
        state.globalChartsLoading = false;
        state.globalCharts = action.payload.data;
        state.globalChartsPeriod = action.payload.period as TopSongsPeriod;
      })
      .addCase(fetchGlobalCharts.rejected, (state, action) => {
        state.globalChartsLoading = false;
        state.globalChartsError = action.payload as string;
      })

      // ==================== Clear History ====================
      .addCase(clearPlayHistory.fulfilled, (state) => {
        state.playHistory = [];
        state.playHistoryPagination = {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasMore: false,
        };
      });
  },
});

// ===================== Actions =====================
export const streamActions = streamSlice.actions;
export const {
  setTopSongsPeriod,
  setGlobalChartsPeriod,
  clearPlayHistoryError,
  clearRecentlyPlayedError,
  clearTopSongsError,
  clearStreamingStatsError,
  clearGlobalChartsError,
  resetStreamState,
} = streamSlice.actions;

// ===================== Selectors =====================
export const selectPlayHistory = (state: RootState) => state.stream.playHistory;
export const selectPlayHistoryLoading = (state: RootState) =>
  state.stream.playHistoryLoading;
export const selectPlayHistoryPagination = (state: RootState) =>
  state.stream.playHistoryPagination;

export const selectRecentlyPlayed = (state: RootState) =>
  state.stream.recentlyPlayed;
export const selectRecentlyPlayedLoading = (state: RootState) =>
  state.stream.recentlyPlayedLoading;

export const selectTopSongs = (state: RootState) => state.stream.topSongs;
export const selectTopSongsLoading = (state: RootState) =>
  state.stream.topSongsLoading;
export const selectTopSongsPeriod = (state: RootState) =>
  state.stream.topSongsPeriod;

export const selectStreamingStats = (state: RootState) =>
  state.stream.streamingStats;
export const selectStreamingStatsLoading = (state: RootState) =>
  state.stream.streamingStatsLoading;

export const selectGlobalCharts = (state: RootState) =>
  state.stream.globalCharts;
export const selectGlobalChartsLoading = (state: RootState) =>
  state.stream.globalChartsLoading;
export const selectGlobalChartsPeriod = (state: RootState) =>
  state.stream.globalChartsPeriod;

export const selectSongPlayCount = (songId: string) => (state: RootState) =>
  state.stream.songPlayCounts[songId];

export const selectIsRecording = (state: RootState) => state.stream.isRecording;

export default streamSlice.reducer;
