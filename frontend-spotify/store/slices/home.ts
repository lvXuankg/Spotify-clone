import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AlbumServices } from "@/services/album";
import { playlistService } from "@/services/playlist";
import type { AlbumListItem } from "@/interfaces/albums";
import type { PublicPlaylistItem } from "@/interfaces/playlists";
import type { RootState } from "../store";

// ===================== Types =====================
interface HomeState {
  // Albums
  latestAlbums: AlbumListItem[];
  latestAlbumsLoading: boolean;
  recentlyUpdatedAlbums: AlbumListItem[];
  recentlyUpdatedAlbumsLoading: boolean;

  // Playlists
  latestPlaylists: PublicPlaylistItem[];
  latestPlaylistsLoading: boolean;
  recentlyUpdatedPlaylists: PublicPlaylistItem[];
  recentlyUpdatedPlaylistsLoading: boolean;

  // General
  error: string | null;
}

const initialState: HomeState = {
  latestAlbums: [],
  latestAlbumsLoading: false,
  recentlyUpdatedAlbums: [],
  recentlyUpdatedAlbumsLoading: false,

  latestPlaylists: [],
  latestPlaylistsLoading: false,
  recentlyUpdatedPlaylists: [],
  recentlyUpdatedPlaylistsLoading: false,

  error: null,
};

// ===================== Async Thunks =====================

// Fetch latest albums (sorted by created_at)
export const fetchLatestAlbums = createAsyncThunk(
  "home/fetchLatestAlbums",
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await AlbumServices.getAllAlbums(
        1,
        limit,
        "created_at",
        "desc"
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch latest albums"
      );
    }
  }
);

// Fetch recently updated albums (sorted by updated_at)
export const fetchRecentlyUpdatedAlbums = createAsyncThunk(
  "home/fetchRecentlyUpdatedAlbums",
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await AlbumServices.getAllAlbums(
        1,
        limit,
        "updated_at",
        "desc"
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch recently updated albums"
      );
    }
  }
);

// Fetch latest playlists (sorted by created_at)
export const fetchLatestPlaylists = createAsyncThunk(
  "home/fetchLatestPlaylists",
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await playlistService.getPublicPlaylists(
        1,
        limit,
        "created_at",
        "desc"
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch latest playlists"
      );
    }
  }
);

// Fetch recently updated playlists (sorted by updated_at)
export const fetchRecentlyUpdatedPlaylists = createAsyncThunk(
  "home/fetchRecentlyUpdatedPlaylists",
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await playlistService.getPublicPlaylists(
        1,
        limit,
        "updated_at",
        "desc"
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch recently updated playlists"
      );
    }
  }
);

// ===================== Slice =====================
const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Latest Albums
    builder
      .addCase(fetchLatestAlbums.pending, (state) => {
        state.latestAlbumsLoading = true;
      })
      .addCase(fetchLatestAlbums.fulfilled, (state, action) => {
        state.latestAlbumsLoading = false;
        state.latestAlbums = action.payload;
      })
      .addCase(fetchLatestAlbums.rejected, (state, action) => {
        state.latestAlbumsLoading = false;
        state.error = action.payload as string;
      });

    // Recently Updated Albums
    builder
      .addCase(fetchRecentlyUpdatedAlbums.pending, (state) => {
        state.recentlyUpdatedAlbumsLoading = true;
      })
      .addCase(fetchRecentlyUpdatedAlbums.fulfilled, (state, action) => {
        state.recentlyUpdatedAlbumsLoading = false;
        state.recentlyUpdatedAlbums = action.payload;
      })
      .addCase(fetchRecentlyUpdatedAlbums.rejected, (state, action) => {
        state.recentlyUpdatedAlbumsLoading = false;
        state.error = action.payload as string;
      });

    // Latest Playlists
    builder
      .addCase(fetchLatestPlaylists.pending, (state) => {
        state.latestPlaylistsLoading = true;
      })
      .addCase(fetchLatestPlaylists.fulfilled, (state, action) => {
        state.latestPlaylistsLoading = false;
        state.latestPlaylists = action.payload;
      })
      .addCase(fetchLatestPlaylists.rejected, (state, action) => {
        state.latestPlaylistsLoading = false;
        state.error = action.payload as string;
      });

    // Recently Updated Playlists
    builder
      .addCase(fetchRecentlyUpdatedPlaylists.pending, (state) => {
        state.recentlyUpdatedPlaylistsLoading = true;
      })
      .addCase(fetchRecentlyUpdatedPlaylists.fulfilled, (state, action) => {
        state.recentlyUpdatedPlaylistsLoading = false;
        state.recentlyUpdatedPlaylists = action.payload;
      })
      .addCase(fetchRecentlyUpdatedPlaylists.rejected, (state, action) => {
        state.recentlyUpdatedPlaylistsLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ===================== Selectors =====================
export const selectLatestAlbums = (state: RootState) => state.home.latestAlbums;
export const selectLatestAlbumsLoading = (state: RootState) =>
  state.home.latestAlbumsLoading;
export const selectRecentlyUpdatedAlbums = (state: RootState) =>
  state.home.recentlyUpdatedAlbums;
export const selectRecentlyUpdatedAlbumsLoading = (state: RootState) =>
  state.home.recentlyUpdatedAlbumsLoading;

export const selectLatestPlaylists = (state: RootState) =>
  state.home.latestPlaylists;
export const selectLatestPlaylistsLoading = (state: RootState) =>
  state.home.latestPlaylistsLoading;
export const selectRecentlyUpdatedPlaylists = (state: RootState) =>
  state.home.recentlyUpdatedPlaylists;
export const selectRecentlyUpdatedPlaylistsLoading = (state: RootState) =>
  state.home.recentlyUpdatedPlaylistsLoading;

export const homeActions = {
  ...homeSlice.actions,
  fetchLatestAlbums,
  fetchRecentlyUpdatedAlbums,
  fetchLatestPlaylists,
  fetchRecentlyUpdatedPlaylists,
};

export default homeSlice.reducer;
