import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AlbumServices } from "@/services/album";
import { playlistService } from "@/services/playlist";
import type { AlbumListItem } from "@/interfaces/albums";
import type { PublicPlaylistItem } from "@/interfaces/playlists";
import type { PaginationMeta } from "@/interfaces/pagination";
import type { RootState } from "../store";

// ===================== Types =====================
type SortType = "latest" | "updated";
type ContentType = "album" | "playlist";

interface ViewAllState {
  // Albums
  albums: AlbumListItem[];
  albumsLoading: boolean;
  albumsPagination: PaginationMeta | null;

  // Playlists
  playlists: PublicPlaylistItem[];
  playlistsLoading: boolean;
  playlistsPagination: PaginationMeta | null;

  // General
  error: string | null;
}

interface FetchAlbumsParams {
  page: number;
  limit: number;
  sortType: SortType;
}

interface FetchPlaylistsParams {
  page: number;
  limit: number;
  sortType: SortType;
}

const initialState: ViewAllState = {
  albums: [],
  albumsLoading: false,
  albumsPagination: null,

  playlists: [],
  playlistsLoading: false,
  playlistsPagination: null,

  error: null,
};

// ===================== Async Thunks =====================

// Fetch albums with pagination
export const fetchAllAlbums = createAsyncThunk(
  "viewAll/fetchAllAlbums",
  async ({ page, limit, sortType }: FetchAlbumsParams, { rejectWithValue }) => {
    try {
      const sortBy = sortType === "latest" ? "created_at" : "updated_at";
      const response = await AlbumServices.getAllAlbums(
        page,
        limit,
        sortBy,
        "desc"
      );
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch albums"
      );
    }
  }
);

// Fetch playlists with pagination
export const fetchAllPlaylists = createAsyncThunk(
  "viewAll/fetchAllPlaylists",
  async (
    { page, limit, sortType }: FetchPlaylistsParams,
    { rejectWithValue }
  ) => {
    try {
      const sortBy = sortType === "latest" ? "created_at" : "updated_at";
      const response = await playlistService.getPublicPlaylists(
        page,
        limit,
        sortBy,
        "desc"
      );
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch playlists"
      );
    }
  }
);

// ===================== Slice =====================
const viewAllSlice = createSlice({
  name: "viewAll",
  initialState,
  reducers: {
    clearAlbums: (state) => {
      state.albums = [];
      state.albumsPagination = null;
    },
    clearPlaylists: (state) => {
      state.playlists = [];
      state.playlistsPagination = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Albums
    builder
      .addCase(fetchAllAlbums.pending, (state) => {
        state.albumsLoading = true;
        state.error = null;
      })
      .addCase(fetchAllAlbums.fulfilled, (state, action) => {
        state.albumsLoading = false;
        state.albums = action.payload.data;
        state.albumsPagination = action.payload.pagination;
      })
      .addCase(fetchAllAlbums.rejected, (state, action) => {
        state.albumsLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Playlists
    builder
      .addCase(fetchAllPlaylists.pending, (state) => {
        state.playlistsLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPlaylists.fulfilled, (state, action) => {
        state.playlistsLoading = false;
        state.playlists = action.payload.data;
        state.playlistsPagination = action.payload.pagination;
      })
      .addCase(fetchAllPlaylists.rejected, (state, action) => {
        state.playlistsLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ===================== Selectors =====================
export const selectAllAlbums = (state: RootState) => state.viewAll.albums;
export const selectAllAlbumsLoading = (state: RootState) =>
  state.viewAll.albumsLoading;
export const selectAlbumsPagination = (state: RootState) =>
  state.viewAll.albumsPagination;

export const selectAllPlaylists = (state: RootState) => state.viewAll.playlists;
export const selectAllPlaylistsLoading = (state: RootState) =>
  state.viewAll.playlistsLoading;
export const selectPlaylistsPagination = (state: RootState) =>
  state.viewAll.playlistsPagination;

export const viewAllActions = {
  ...viewAllSlice.actions,
  fetchAllAlbums,
  fetchAllPlaylists,
};

export default viewAllSlice.reducer;
