import api from "@/lib/axios";

export interface SearchResult {
  type: "song" | "artist" | "album" | "playlist";
  id: string;
  title?: string;
  name?: string;
  artist?: string;
  album?: string;
  album_id?: string;
  description?: string;
  cover_url?: string;
  duration?: number;
  audio_url?: string;
  score?: number;
}

export interface SearchResponse {
  total: number;
  results?: SearchResult[];
  items?: SearchResult[];
}

export const searchService = {
  searchAll: async (
    query: string,
    from: number = 0,
    size: number = 20
  ): Promise<SearchResponse> => {
    try {
      const { data } = await api.get<SearchResponse>(
        `/search?q=${encodeURIComponent(query)}&from=${from}&size=${size}`
      );
      return data;
    } catch (error) {
      console.error("Search all error:", error);
      return { total: 0, results: [] };
    }
  },

  // Search songs only
  searchSongs: async (
    query: string,
    from: number = 0,
    size: number = 20
  ): Promise<SearchResponse> => {
    try {
      const { data } = await api.get<SearchResponse>(
        `/search/songs?q=${encodeURIComponent(query)}&from=${from}&size=${size}`
      );
      return data;
    } catch (error) {
      console.error("Search songs error:", error);
      return { total: 0, items: [] };
    }
  },

  // Search artists only
  searchArtists: async (
    query: string,
    from: number = 0,
    size: number = 20
  ): Promise<SearchResponse> => {
    try {
      const { data } = await api.get<SearchResponse>(
        `/search/artists?q=${encodeURIComponent(
          query
        )}&from=${from}&size=${size}`
      );
      return data;
    } catch (error) {
      console.error("Search artists error:", error);
      return { total: 0, items: [] };
    }
  },

  // Search albums only
  searchAlbums: async (
    query: string,
    from: number = 0,
    size: number = 20
  ): Promise<SearchResponse> => {
    try {
      const { data } = await api.get<SearchResponse>(
        `/search/albums?q=${encodeURIComponent(
          query
        )}&from=${from}&size=${size}`
      );
      return data;
    } catch (error) {
      console.error("Search albums error:", error);
      return { total: 0, items: [] };
    }
  },

  // Search playlists only
  searchPlaylists: async (
    query: string,
    from: number = 0,
    size: number = 20
  ): Promise<SearchResponse> => {
    try {
      const { data } = await api.get<SearchResponse>(
        `/search/playlists?q=${encodeURIComponent(
          query
        )}&from=${from}&size=${size}`
      );
      return data;
    } catch (error) {
      console.error("Search playlists error:", error);
      return { total: 0, items: [] };
    }
  },
};
