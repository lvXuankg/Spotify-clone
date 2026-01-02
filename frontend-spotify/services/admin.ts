import api from "@/lib/axios";

// ============ USERS ============
export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: "USER" | "ADMIN" | "ARTIST" | "MEMBER";
  created_at: string;
  updated_at: string;
}

export interface UsersResponse {
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============ SONGS ============
export interface AdminSong {
  id: string;
  title: string;
  duration_seconds: number;
  audio_url: string;
  play_count: number;
  created_at: string;
  albums?: {
    id: string;
    title: string;
    cover_url?: string;
    artists?: {
      id: string;
      display_name: string;
    };
  };
}

export interface SongsResponse {
  data: AdminSong[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============ PLAYLISTS ============
export interface AdminPlaylist {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  is_public: boolean;
  user_id: string;
  song_count: number;
  created_at: string;
  updated_at: string;
  owner?: {
    id: string;
    name: string | null;
  };
}

export interface PlaylistsResponse {
  data: AdminPlaylist[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============ ARTISTS ============
export interface AdminArtist {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  verified: boolean;
  monthly_listeners: number;
  created_at: string;
}

export interface ArtistsResponse {
  data: AdminArtist[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============ API CALLS ============

// Users
const getAllUsers = (page = 1, limit = 10, search?: string) => {
  return api.get<UsersResponse>("/user/all", {
    params: { page, limit, search },
  });
};

const updateUserRole = (userId: string, role: string) => {
  return api.patch(`/user/${userId}/role`, { role });
};

const deleteUser = (userId: string) => {
  return api.delete(`/user/${userId}`);
};

// Songs
const getAllSongs = (page = 1, limit = 10, search?: string) => {
  return api.get<SongsResponse>("/song/all", {
    params: { page, limit, search },
  });
};

const deleteSong = (songId: string) => {
  return api.delete(`/song/${songId}`);
};

// Playlists
const getAllPlaylists = (page = 1, limit = 10, search?: string) => {
  return api.get<PlaylistsResponse>("/playlist/public", {
    params: { page, limit, search },
  });
};

const deletePlaylist = (playlistId: string) => {
  return api.delete(`/playlist/${playlistId}`);
};

// Artists
const getAllArtists = (page = 1, limit = 10, search?: string) => {
  return api.get<ArtistsResponse>("/artist", {
    params: { page, limit, search },
  });
};

const createArtist = (data: {
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}) => {
  return api.post("/artist", data);
};

const updateArtist = (
  artistId: string,
  data: { displayName?: string; bio?: string; avatarUrl?: string }
) => {
  return api.patch(`/artist/${artistId}`, data);
};

const deleteArtist = (artistId: string) => {
  return api.delete(`/artist/${artistId}`);
};

// Dashboard stats
const getDashboardStats = () => {
  return api.get("/admin/stats");
};

export const adminService = {
  // Users
  getAllUsers,
  updateUserRole,
  deleteUser,
  // Songs
  getAllSongs,
  deleteSong,
  // Playlists
  getAllPlaylists,
  deletePlaylist,
  // Artists
  getAllArtists,
  createArtist,
  updateArtist,
  deleteArtist,
  // Dashboard
  getDashboardStats,
};
