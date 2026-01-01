import {
  Playlist,
  PlaylistAddSong,
  PlaylistDetail,
  PlaylistSimple,
  UpdatePlaylist,
} from "@/interfaces/playlists";
import api from "@/lib/axios";

const PLAYLIST_URL = "/playlist";

const createPlaylistDefault = () => {
  return api.post<Playlist>(`${PLAYLIST_URL}`, {
    title: "Danh sách phát của tôi #" + Date.now(),
  });
};

const updatePlaylist = (playlistId: string, dto: UpdatePlaylist) => {
  return api.patch<Playlist>(`${PLAYLIST_URL}/${playlistId}`, dto);
};

const updateImagePlaylist = (playlistId: string, coverUrl: string) => {
  return api.patch<Playlist>(`${PLAYLIST_URL}/${playlistId}`, { coverUrl });
};

const deletePlaylist = (playlistId: string) => {
  return api.delete<Playlist>(`${PLAYLIST_URL}/${playlistId}`);
};

const addSongToPlaylist = (playlistId: string, songId: string) => {
  return api.post<PlaylistAddSong>(
    `${PLAYLIST_URL}/${playlistId}/song/${songId}`
  );
};

const getDetailPlaylist = (playlistId: string) => {
  return api.get<PlaylistDetail>(`${PLAYLIST_URL}/${playlistId}`);
};

const getMyPlaylist = () => {
  return api.get<PlaylistSimple[]>(`${PLAYLIST_URL}/get-my-playlists`);
};

export const playlistService = {
  createPlaylistDefault,
  updatePlaylist,
  updateImagePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  getDetailPlaylist,
  getMyPlaylist,
};
