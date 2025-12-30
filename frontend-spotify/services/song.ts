import api from "@/lib/axios";

import type {
  Song,
  SongWithAlbum,
  CreateSongDto,
  UpdateSongDto,
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

export const SongService = {
  createSong,
  updateSong,
  findAllSongs,
  findOneSong,
  deleteSong,
};
