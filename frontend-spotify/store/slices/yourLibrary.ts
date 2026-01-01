import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { playlistService } from "@/services/playlist";
import type { PlaylistSimple } from "@/interfaces/playlists";

// ===================== Types =====================
export type LibraryViewMode = "list" | "compact-list" | "grid" | "compact-grid";
export type LibraryFilterType = "all" | "playlist" | "album" | "artist";

export interface LibraryItem {
  id: string;
  name: string;
  type: "playlist" | "album" | "artist";
  image_url: string;
  subtitle?: string;
  song_count?: number;
  updated_at?: string;
}

interface YourLibraryState {
  items: LibraryItem[];
  playlists: PlaylistSimple[];
  albums: LibraryItem[];
  artists: LibraryItem[];
  loading: boolean;
  error: string | null;
  view: LibraryViewMode;
  filter: LibraryFilterType;
  searchQuery: string;
}

const initialState: YourLibraryState = {
  items: [],
  playlists: [],
  albums: [],
  artists: [],
  loading: false,
  error: null,
  view: "list",
  filter: "all",
  searchQuery: "",
};

// ===================== Async Thunks =====================

// Fetch my playlists for library
export const fetchMyPlaylists = createAsyncThunk(
  "yourLibrary/fetchMyPlaylists",
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

// Placeholder for albums (implement when needed)
export const fetchMyAlbums = createAsyncThunk(
  "yourLibrary/fetchMyAlbums",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement album service call
      return [] as LibraryItem[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch albums"
      );
    }
  }
);

// Placeholder for artists (implement when needed)
export const fetchMyArtists = createAsyncThunk(
  "yourLibrary/fetchMyArtists",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement artist service call
      return [] as LibraryItem[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch artists"
      );
    }
  }
);

// ===================== Slice =====================
const yourLibrarySlice = createSlice({
  name: "yourLibrary",
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<LibraryViewMode>) => {
      state.view = action.payload;
    },
    setFilter: (state, action: PayloadAction<LibraryFilterType>) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addPlaylistToLibrary: (state, action: PayloadAction<PlaylistSimple>) => {
      state.playlists.unshift(action.payload);
      state.items.unshift({
        id: action.payload.id,
        name: action.payload.title,
        type: "playlist",
        image_url: action.payload.cover_url || "",
        song_count: action.payload.song_count,
        updated_at: action.payload.updated_at,
      });
    },
    removePlaylistFromLibrary: (state, action: PayloadAction<string>) => {
      state.playlists = state.playlists.filter((p) => p.id !== action.payload);
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updatePlaylistInLibrary: (
      state,
      action: PayloadAction<Partial<PlaylistSimple> & { id: string }>
    ) => {
      const playlistIndex = state.playlists.findIndex(
        (p) => p.id === action.payload.id
      );
      if (playlistIndex !== -1) {
        state.playlists[playlistIndex] = {
          ...state.playlists[playlistIndex],
          ...action.payload,
        };
      }
      const itemIndex = state.items.findIndex(
        (i) => i.id === action.payload.id && i.type === "playlist"
      );
      if (itemIndex !== -1) {
        if (action.payload.title) {
          state.items[itemIndex].name = action.payload.title;
        }
        if (action.payload.cover_url !== undefined) {
          state.items[itemIndex].image_url = action.payload.cover_url || "";
        }
      }
    },
    clearLibrary: (state) => {
      state.items = [];
      state.playlists = [];
      state.albums = [];
      state.artists = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch playlists
    builder
      .addCase(fetchMyPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
        // Convert playlists to library items
        const playlistItems: LibraryItem[] = action.payload.map((p) => ({
          id: p.id,
          name: p.title,
          type: "playlist" as const,
          image_url: p.cover_url || "",
          song_count: p.song_count,
          updated_at: p.updated_at,
        }));
        // Merge with existing items (replace playlists)
        state.items = [
          ...playlistItems,
          ...state.items.filter((i) => i.type !== "playlist"),
        ];
      })
      .addCase(fetchMyPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch albums
    builder
      .addCase(fetchMyAlbums.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload;
        // Merge with existing items
        state.items = [
          ...state.items.filter((i) => i.type !== "album"),
          ...action.payload,
        ];
      })
      .addCase(fetchMyAlbums.rejected, (state) => {
        state.loading = false;
      });

    // Fetch artists
    builder
      .addCase(fetchMyArtists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyArtists.fulfilled, (state, action) => {
        state.loading = false;
        state.artists = action.payload;
        // Merge with existing items
        state.items = [
          ...state.items.filter((i) => i.type !== "artist"),
          ...action.payload,
        ];
      })
      .addCase(fetchMyArtists.rejected, (state) => {
        state.loading = false;
      });
  },
});

// ===================== Selectors =====================
export const getLibraryItems = (state: RootState): LibraryItem[] => {
  const { items, filter, searchQuery } = state.yourLibrary;
  let filteredItems: LibraryItem[] = items;

  // Apply type filter
  if (filter !== "all") {
    filteredItems = filteredItems.filter(
      (item: LibraryItem) => item.type === filter
    );
  }

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredItems = filteredItems.filter((item: LibraryItem) =>
      item.name.toLowerCase().includes(query)
    );
  }

  return filteredItems;
};

export const getLibraryPlaylists = (state: RootState) =>
  state.yourLibrary.playlists;
export const getLibraryView = (state: RootState) => state.yourLibrary.view;
export const getLibraryFilter = (state: RootState) => state.yourLibrary.filter;
export const getLibraryLoading = (state: RootState) =>
  state.yourLibrary.loading;

export const yourLibraryActions = {
  ...yourLibrarySlice.actions,
  fetchMyPlaylists,
  fetchMyAlbums,
  fetchMyArtists,
};

export default yourLibrarySlice.reducer;
