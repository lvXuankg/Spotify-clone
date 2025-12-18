import {
  Artist,
  CreateArtistDto,
  FindAllArtistsResponse,
  UpdateArtistDto,
} from "@/interfaces/artist";
import api from "@/lib/axios";

const ARTIST_URL = "/artist";

const getListArtists = (page: number, limit: number = 20) => {
  return api.get<FindAllArtistsResponse>(
    `${ARTIST_URL}?page=${page}&limit=${limit}`
  );
};

const getArtistById = (artistId: string) => {
  return api.get<Artist>(`${ARTIST_URL}/${artistId}`);
};

const createArtist = (dto: CreateArtistDto) => {
  return api.post<Artist>(`${ARTIST_URL}`, dto);
};

const updateArtist = (artistId: string, dto: UpdateArtistDto) => {
  return api.patch<Artist>(`${ARTIST_URL}/${artistId}`, dto);
};

const deleteArtist = (artistId: string) => {
  return api.delete<boolean>(`${ARTIST_URL}/${artistId}`);
};

export const ArtistServices = {
  getListArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
};
