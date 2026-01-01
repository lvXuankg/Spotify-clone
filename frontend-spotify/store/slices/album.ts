import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AlbumServices } from "@/services/album";
import { SongService } from "@/services/song";
import type { AlbumWithArtist } from "@/interfaces/albums";
import type { Song } from "@/interfaces/song";
import type { RootState } from "../store";

// ===================== Types =====================
interface AlbumState {
  currentAlbum: AlbumWithArtist | null;
  currentAlbumLoading: boolean;
  currentAlbumError: string | null;
  songs: Song[];
  songsLoading: boolean;
  songsError: string | null;
}

const initialState: AlbumState = {
  currentAlbum: null,
  currentAlbumLoading: false,
  currentAlbumError: null,
  songs: [],
  songsLoading: false,
  songsError: null,
};

// ===================== Async Thunks =====================

// Fetch album detail
export const fetchAlbumDetail = createAsyncThunk(
  "album/fetchAlbumDetail",
  async (albumId: string, { rejectWithValue }) => {
    try {
      const response = await AlbumServices.getAlbum(albumId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch album"
      );
    }
  }
);

// Fetch album songs
export const fetchAlbumSongs = createAsyncThunk(
  "album/fetchAlbumSongs",
  async (albumId: string, { rejectWithValue }) => {
    try {
      const response = await SongService.findAllSongs(albumId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch songs"
      );
    }
  }
);

// ===================== Slice =====================
const albumSlice = createSlice({
  name: "album",
  initialState,
  reducers: {
    clearCurrentAlbum: (state) => {
      state.currentAlbum = null;
      state.currentAlbumError = null;
      state.songs = [];
      state.songsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch album detail
      .addCase(fetchAlbumDetail.pending, (state) => {
        state.currentAlbumLoading = true;
        state.currentAlbumError = null;
      })
      .addCase(fetchAlbumDetail.fulfilled, (state, action) => {
        state.currentAlbumLoading = false;
        state.currentAlbum = action.payload;
      })
      .addCase(fetchAlbumDetail.rejected, (state, action) => {
        state.currentAlbumLoading = false;
        state.currentAlbumError = action.payload as string;
      })
      // Fetch album songs
      .addCase(fetchAlbumSongs.pending, (state) => {
        state.songsLoading = true;
        state.songsError = null;
      })
      .addCase(fetchAlbumSongs.fulfilled, (state, action) => {
        state.songsLoading = false;
        state.songs = action.payload;
      })
      .addCase(fetchAlbumSongs.rejected, (state, action) => {
        state.songsLoading = false;
        state.songsError = action.payload as string;
      });
  },
});

// ===================== Selectors =====================
export const selectCurrentAlbum = (state: RootState) =>
  state.album.currentAlbum;
export const selectCurrentAlbumLoading = (state: RootState) =>
  state.album.currentAlbumLoading;
export const selectAlbumSongs = (state: RootState) => state.album.songs;
export const selectAlbumSongsLoading = (state: RootState) =>
  state.album.songsLoading;

export const albumActions = {
  ...albumSlice.actions,
  fetchAlbumDetail,
  fetchAlbumSongs,
};

export default albumSlice.reducer;
