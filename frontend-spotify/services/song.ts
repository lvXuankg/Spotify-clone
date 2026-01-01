import api from "@/lib/axios";

import {
  type Song,
  type SongWithAlbum,
  type CreateSongDto,
  type UpdateSongDto,
  ResponseFindTitleSong,
} from "@/interfaces/song";

const SONG_URL = "/song";

const createSong = (albumId: string, data: CreateSongDto) => {
  return api.post<Song>(`${SONG_URL}/${albumId}`, data);
};

const updateSong = (songId: string, data: UpdateSongDto) => {
  return api.patch<Song>(`${SONG_URL}/${songId}`, data);
};

const findAllSongs = (albumId: string) => {
  return api.get<Song[]>(`${SONG_URL}/album/${albumId}`);
};

const findOneSong = (songId: string) => {
  return api.get<SongWithAlbum>(`${SONG_URL}/${songId}`);
};

const deleteSong = (songId: string) => {
  return api.delete<Song>(`${SONG_URL}/${songId}`);
};

const findSongs = (keyword: string, page: number, limit: number) => {
  return api.get<ResponseFindTitleSong>(
    `${SONG_URL}/search?keyword=${keyword}&page=${page}&limit=${limit}`
  );
};

export const SongService = {
  createSong,
  updateSong,
  findAllSongs,
  findOneSong,
  deleteSong,
  findSongs,
};
