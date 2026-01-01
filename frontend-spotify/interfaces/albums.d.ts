import type { SimpleArtist } from "./artist";

export type AlbumType = "SINGLE" | "EP" | "ALBUM";

export interface Album {
  /** @description Định danh duy nhất của album (UUID) */
  id: string;

  /** @description ID của nghệ sĩ sở hữu album */
  artist_id: string;

  /** @description Tên/tiêu đề của album */
  title: string;

  /** @description URL ảnh bìa của album */
  cover_url?: string | null;

  /** @description Ngày phát hành album */
  release_date?: string | null;

  /** @description Loại album: SINGLE, EP, ALBUM */
  type: AlbumType;

  /** @description Thời gian tạo album (ISO 8601) */
  created_at: string;

  /** @description Thời gian cập nhật lần cuối (ISO 8601) */
  updated_at: string;

  /** @description Camel case properties từ API response */
  artistId?: string;
  coverUrl?: string | null;
  releaseDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAlbumDto {
  /** @description Tên/tiêu đề của album (bắt buộc) */
  title: string;

  /** @description URL ảnh bìa của album */
  coverUrl?: string | null;

  /** @description Ngày phát hành album */
  releaseDate?: string | null;

  /** @description Loại album: SINGLE, EP, ALBUM */
  type?: AlbumType;
}

export interface UpdateAlbumDto {
  /** @description Tên/tiêu đề của album */
  title?: string;

  /** @description URL ảnh bìa của album */
  coverUrl?: string | null;

  /** @description Ngày phát hành album */
  releaseDate?: string | null;

  /** @description Loại album: SINGLE, EP, ALBUM */
  type?: AlbumType;
}

export interface GetAlbumsResponse {
  data: Album[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface AlbumWithArtist extends Album {
  artists: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
}

export interface AlbumListItem {
  id: string;
  title: string;
  cover_url: string | null;
  type: AlbumType;
  release_date: string | null;
  created_at: string;
  updated_at: string;
  artist: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
}

export interface GetAllAlbumsResponse {
  data: AlbumListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
