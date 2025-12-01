import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Image {
  url: string;
  height?: number;
  width?: number;
}

interface Artist {
  id: string;
  name: string;
}

interface Album {
  id: string;
  name: string;
  images?: Image[];
  release_date?: string;
}

interface Owner {
  id: string;
  display_name: string;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  images: Image[];
  owner?: Owner;
  // TODO: Thêm các field khác
}

interface Track {
  id: string;
  name: string;
  artists?: Artist[];
  album?: Album;
  images?: Image[];
  // TODO: Thêm các field khác
}

interface RecentlyPlayedItem extends Track {
  // Can be Track, Album, or Playlist
  owner?: Owner;
  release_date?: string;
}

interface HomeState {
  loading: boolean;
  error?: string;
  featuredPlaylists: Playlist[];
  recentlyPlayed: RecentlyPlayedItem[];
  // TODO: Thêm các field khác
}

const initialState: HomeState = {
  loading: false,
  error: undefined,
  featuredPlaylists: [
    // Mock data
    {
      id: "1",
      name: "Trending Now",
      description: "The hottest tracks right now",
      images: [{ url: "https://via.placeholder.com/300" }],
    },
    {
      id: "2",
      name: "Chill Vibes",
      description: "Relax with these calming songs",
      images: [{ url: "https://via.placeholder.com/300" }],
    },
  ],
  recentlyPlayed: [
    // Mock data
    {
      id: "1",
      name: "Song 1",
      artists: [{ id: "artist1", name: "Artist 1" }],
      album: {
        id: "album1",
        name: "Album 1",
        images: [{ url: "https://via.placeholder.com/300" }],
      },
      images: [{ url: "https://via.placeholder.com/300" }],
    },
    {
      id: "2",
      name: "Song 2",
      artists: [{ id: "artist2", name: "Artist 2" }],
      album: {
        id: "album2",
        name: "Album 2",
        images: [{ url: "https://via.placeholder.com/300" }],
      },
      images: [{ url: "https://via.placeholder.com/300" }],
    },
  ],
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFeaturedPlaylists: (state, action: PayloadAction<Playlist[]>) => {
      state.featuredPlaylists = action.payload;
    },
    setRecentlyPlayed: (state, action: PayloadAction<RecentlyPlayedItem[]>) => {
      state.recentlyPlayed = action.payload;
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
    // TODO: Thêm các action khác
    fetchFeaturedPlaylists: (state) => {
      // TODO: Implement thực tế
      state.loading = true;
    },
    fetchRecentlyPlayed: (state) => {
      // TODO: Implement thực tế
      state.loading = true;
    },
  },
});

export const homeActions = homeSlice.actions;
export default homeSlice.reducer;
