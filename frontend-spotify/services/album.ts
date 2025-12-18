import {
  Album,
  CreateAlbumDto,
  UpdateAlbumDto,
  GetAlbumsResponse,
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
    `${ALBUM_URL}/${artistId}?page=${page}&limit=${limit}`
  );
};

export const AlbumServices = {
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getAlbums,
};
