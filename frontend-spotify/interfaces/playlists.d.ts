export interface Playlist {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  cover_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface Artist {
  id: string;
  display_name: string;
  avatar_url?: string | null;
}

export interface PlaylistAddSong {
  id: string;
  playlist_id: string;
  song_id: string;
  added_by: string;
  position: number;
  created_at: string;
}

export interface PlaylistSong {
  id: string;
  title: string;
  duration: number;
  audio_url: string;
  position: number;
  artist: Artist | null;
}

export interface PlaylistDetail {
  id: string;
  title: string;
  description?: string | null;
  cover_url?: string | null;
  is_public: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  songs: PlaylistSong[];
}

interface PlaylistSimple {
  id: string;
  title: string;
  cover_url: string;
  is_public: boolean;
  song_count: number;
  updated_at: string;
}

export interface CreatePlaylist {
  title: string;
  description?: string;
  coverUrl?: string;
  isPublic?: boolean;
}

export interface UpdatePlaylist {
  title?: string;
  description?: string;
  coverUrl?: string;
  isPublic?: boolean;
}

export interface PublicPlaylistItem {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  is_public: boolean;
  song_count: number;
  created_at: string;
  updated_at: string;
  owner: {
    id: string;
    name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface GetPublicPlaylistsResponse {
  data: PublicPlaylistItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
