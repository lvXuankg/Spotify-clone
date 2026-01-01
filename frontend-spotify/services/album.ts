import {
  Album,
  CreateAlbumDto,
  UpdateAlbumDto,
  GetAlbumsResponse,
  AlbumWithArtist,
  GetAllAlbumsResponse,
} from "@/interfaces/albums";
import api from "@/lib/axios";

const ALBUM_URL = "album";

const createAlbum = (artistId: string, dto: CreateAlbumDto) => {
  return api.post<Album>(`${ALBUM_URL}/${artistId}`, dto);
};

const updateAlbum = (id: string, dto: UpdateAlbumDto) => {
  return api.patch<Album>(`${ALBUM_URL}/${id}`, dto);
};

const deleteAlbum = (id: string) => {
  return api.delete<Album>(`${ALBUM_URL}/${id}`);
};

const getAlbums = (artistId: string, page: number = 1, limit: number = 10) => {
  return api.get<GetAlbumsResponse>(
    `${ALBUM_URL}/list/${artistId}?page=${page}&limit=${limit}`
  );
};

const getAlbum = (albumId: string) => {
  return api.get<AlbumWithArtist>(`${ALBUM_URL}/${albumId}`);
};

const getAllAlbums = (
  page: number = 1,
  limit: number = 10,
  sortBy: "created_at" | "updated_at" = "created_at",
  order: "asc" | "desc" = "desc"
) => {
  return api.get<GetAllAlbumsResponse>(
    `${ALBUM_URL}?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`
  );
};

export const AlbumServices = {
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getAlbums,
  getAlbum,
  getAllAlbums,
};
