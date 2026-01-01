import { PaginationMeta } from "./pagination";

export interface Song {
  id: string;
  album_id: string;
  title: string;
  duration_seconds: number;
  audio_url: string;
  track_number?: number | null;
  disc_number: number;
  is_explicit: boolean;
  bitrate?: number | null;
  play_count: number;
  created_at: string;
  updated_at: string;
}

export interface SongWithAlbum extends Song {
  albums: {
    id: string;
    title: string;
    cover_url?: string | null;
    artists: {
      id: string;
      display_name: string;
    };
  };
}

export interface CreateSongDto {
  albumId: string;
  title: string;
  durationSeconds: number;
  audioUrl: string;
  trackNumber?: number;
  discNumber?: number;
  isExplicit?: boolean;
  bitrate?: number;
}

export interface UpdateSongDto {
  title?: string;
  durationSeconds?: number;
  audioUrl?: string;
  trackNumber?: number;
  discNumber?: number;
  isExplicit?: boolean;
  bitrate?: number;
}

interface Artist {
  id: string;
  display_name: string;
}

interface SongFindTitleResponse extends Song {
  albums: { id: string; title: string; artists: Artist };
}

export interface ResponseFindTitleSong {
  data: SongFindTitleResponse[];
  pagination: PaginationMeta;
}
