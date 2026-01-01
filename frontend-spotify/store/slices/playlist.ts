import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { playlistService } from "@/services/playlist";
import type {
  Playlist,
  PlaylistDetail,
  PlaylistSimple,
  UpdatePlaylist,
} from "@/interfaces/playlists";
import type { RootState } from "../store";

// ===================== Types =====================
interface PlaylistState {
  // Current playlist detail
  currentPlaylist: PlaylistDetail | null;
  currentPlaylistLoading: boolean;
  currentPlaylistError: string | null;

  // My playlists list
  myPlaylists: PlaylistSimple[];
  myPlaylistsLoading: boolean;
  myPlaylistsError: string | null;

  // Operation states
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  addSongLoading: boolean;
}

const initialState: PlaylistState = {
  currentPlaylist: null,
  currentPlaylistLoading: false,
  currentPlaylistError: null,

  myPlaylists: [],
  myPlaylistsLoading: false,
  myPlaylistsError: null,

  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  addSongLoading: false,
};

// ===================== Async Thunks =====================

// Fetch my playlists
export const fetchMyPlaylists = createAsyncThunk(
  "playlist/fetchMyPlaylists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await playlistService.getMyPlaylist();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch playlists"
      );
    }
  }
);

// Fetch playlist detail
export const fetchPlaylistDetail = createAsyncThunk(
  "playlist/fetchPlaylistDetail",
  async (playlistId: string, { rejectWithValue }) => {
    try {
      const response = await playlistService.getDetailPlaylist(playlistId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch playlist detail"
      );
    }
  }
);

// Create default playlist
export const createPlaylistDefault = createAsyncThunk(
  "playlist/createDefault",
  async (_, { rejectWithValue }) => {
    try {
      const response = await playlistService.createPlaylistDefault();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create playlist"
      );
    }
  }
);

// Update playlist info
export const updatePlaylist = createAsyncThunk(
  "playlist/update",
  async (
    { playlistId, dto }: { playlistId: string; dto: UpdatePlaylist },
    { rejectWithValue }
  ) => {
    try {
      const response = await playlistService.updatePlaylist(playlistId, dto);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update playlist"
      );
    }
  }
);

// Update playlist cover image
export const updatePlaylistImage = createAsyncThunk(
  "playlist/updateImage",
  async (
    { playlistId, coverUrl }: { playlistId: string; coverUrl: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await playlistService.updateImagePlaylist(
        playlistId,
        coverUrl
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update playlist image"
      );
    }
  }
);

// Delete playlist
export const deletePlaylist = createAsyncThunk(
  "playlist/delete",
  async (playlistId: string, { rejectWithValue }) => {
    try {
      await playlistService.deletePlaylist(playlistId);
      return playlistId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete playlist"
      );
    }
  }
);

// Add song to playlist
export const addSongToPlaylist = createAsyncThunk(
  "playlist/addSong",
  async (
    { playlistId, songId }: { playlistId: string; songId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await playlistService.addSongToPlaylist(
        playlistId,
        songId
      );
      return { playlistId, songId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add song to playlist"
      );
    }
  }
);

// ===================== Slice =====================
const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = null;
      state.currentPlaylistError = null;
    },
    clearError: (state) => {
      state.currentPlaylistError = null;
      state.myPlaylistsError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch my playlists
    builder
      .addCase(fetchMyPlaylists.pending, (state) => {
        state.myPlaylistsLoading = true;
        state.myPlaylistsError = null;
      })
      .addCase(fetchMyPlaylists.fulfilled, (state, action) => {
        state.myPlaylistsLoading = false;
        state.myPlaylists = action.payload;
      })
      .addCase(fetchMyPlaylists.rejected, (state, action) => {
        state.myPlaylistsLoading = false;
        state.myPlaylistsError = action.payload as string;
      });

    // Fetch playlist detail
    builder
      .addCase(fetchPlaylistDetail.pending, (state) => {
        state.currentPlaylistLoading = true;
        state.currentPlaylistError = null;
      })
      .addCase(fetchPlaylistDetail.fulfilled, (state, action) => {
        state.currentPlaylistLoading = false;
        state.currentPlaylist = action.payload;
      })
      .addCase(fetchPlaylistDetail.rejected, (state, action) => {
        state.currentPlaylistLoading = false;
        state.currentPlaylistError = action.payload as string;
      });

    // Create default playlist
    builder
      .addCase(createPlaylistDefault.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createPlaylistDefault.fulfilled, (state, action) => {
        state.createLoading = false;
        // Add new playlist to the beginning of list
        const newPlaylist: PlaylistSimple = {
          id: action.payload.id,
          title: action.payload.title,
          cover_url: action.payload.cover_url || "",
          is_public: action.payload.is_public,
          song_count: 0,
          updated_at: action.payload.updated_at,
        };
        state.myPlaylists.unshift(newPlaylist);
      })
      .addCase(createPlaylistDefault.rejected, (state) => {
        state.createLoading = false;
      });

    // Update playlist
    builder
      .addCase(updatePlaylist.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Update in myPlaylists list
        const index = state.myPlaylists.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.myPlaylists[index] = {
            ...state.myPlaylists[index],
            title: action.payload.title,
            cover_url: action.payload.cover_url || "",
            is_public: action.payload.is_public,
            updated_at: action.payload.updated_at,
          };
        }
        // Update current playlist if viewing
        if (state.currentPlaylist?.id === action.payload.id) {
          state.currentPlaylist = {
            ...state.currentPlaylist,
            title: action.payload.title,
            description: action.payload.description,
            cover_url: action.payload.cover_url,
            is_public: action.payload.is_public,
            updated_at: action.payload.updated_at,
          };
        }
      })
      .addCase(updatePlaylist.rejected, (state) => {
        state.updateLoading = false;
      });

    // Update playlist image
    builder
      .addCase(updatePlaylistImage.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updatePlaylistImage.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Update in myPlaylists list
        const index = state.myPlaylists.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.myPlaylists[index].cover_url = action.payload.cover_url || "";
        }
        // Update current playlist if viewing
        if (state.currentPlaylist?.id === action.payload.id) {
          state.currentPlaylist.cover_url = action.payload.cover_url;
        }
      })
      .addCase(updatePlaylistImage.rejected, (state) => {
        state.updateLoading = false;
      });

    // Delete playlist
    builder
      .addCase(deletePlaylist.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.myPlaylists = state.myPlaylists.filter(
          (p) => p.id !== action.payload
        );
        if (state.currentPlaylist?.id === action.payload) {
          state.currentPlaylist = null;
        }
      })
      .addCase(deletePlaylist.rejected, (state) => {
        state.deleteLoading = false;
      });

    // Add song to playlist
    builder
      .addCase(addSongToPlaylist.pending, (state) => {
        state.addSongLoading = true;
      })
      .addCase(addSongToPlaylist.fulfilled, (state, action) => {
        state.addSongLoading = false;
        // Increment song count in myPlaylists
        const index = state.myPlaylists.findIndex(
          (p) => p.id === action.payload.playlistId
        );
        if (index !== -1) {
          state.myPlaylists[index].song_count += 1;
        }
      })
      .addCase(addSongToPlaylist.rejected, (state) => {
        state.addSongLoading = false;
      });
  },
});

// ===================== Selectors =====================
export const selectMyPlaylists = (state: RootState) =>
  state.playlist.myPlaylists;
export const selectMyPlaylistsLoading = (state: RootState) =>
  state.playlist.myPlaylistsLoading;
export const selectCurrentPlaylist = (state: RootState) =>
  state.playlist.currentPlaylist;
export const selectCurrentPlaylistLoading = (state: RootState) =>
  state.playlist.currentPlaylistLoading;
export const selectPlaylistOperationLoading = (state: RootState) => ({
  create: state.playlist.createLoading,
  update: state.playlist.updateLoading,
  delete: state.playlist.deleteLoading,
  addSong: state.playlist.addSongLoading,
});

export const playlistActions = {
  ...playlistSlice.actions,
  fetchMyPlaylists,
  fetchPlaylistDetail,
  createPlaylistDefault,
  updatePlaylist,
  updatePlaylistImage,
  deletePlaylist,
  addSongToPlaylist,
};

export default playlistSlice.reducer;
