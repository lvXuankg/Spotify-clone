import {
  Playlist,
  PlaylistAddSong,
  PlaylistDetail,
  PlaylistSimple,
  UpdatePlaylist,
  GetPublicPlaylistsResponse,
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

const removeSongFromPlaylist = (playlistId: string, songId: string) => {
  return api.delete(`${PLAYLIST_URL}/${playlistId}/song/${songId}`);
};

const getDetailPlaylist = (playlistId: string) => {
  return api.get<PlaylistDetail>(`${PLAYLIST_URL}/${playlistId}`);
};

const getMyPlaylist = () => {
  return api.get<PlaylistSimple[]>(`${PLAYLIST_URL}/get-my-playlists`);
};

const getPublicPlaylists = (
  page: number = 1,
  limit: number = 10,
  sortBy: "created_at" | "updated_at" = "created_at",
  order: "asc" | "desc" = "desc"
) => {
  return api.get<GetPublicPlaylistsResponse>(
    `${PLAYLIST_URL}/public?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`
  );
};

export const playlistService = {
  createPlaylistDefault,
  updatePlaylist,
  updateImagePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getDetailPlaylist,
  getMyPlaylist,
  getPublicPlaylists,
};
