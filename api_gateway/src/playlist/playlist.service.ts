import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @Inject('PLAYLIST_SERVICE') private readonly client: ClientProxy,
  ) {}

  async createPlaylist(userId: string, dto: CreatePlaylistDto) {
    return sendMicroserviceRequest(this.client, 'playlist.create', {
      userId,
      ...dto,
    });
  }

  async updatePlaylist(
    userId: string,
    playlistId: string,
    dto: UpdatePlaylistDto,
  ) {
    return sendMicroserviceRequest(this.client, 'playlist.update', {
      userId,
      playlistId,
      ...dto,
    });
  }

  async deletePlaylist(userId: string, playlistId: string) {
    return sendMicroserviceRequest(this.client, 'playlist.delete', {
      userId,
      playlistId,
    });
  }

  async addSongToPlaylist(userId: string, playlistId: string, songId: string) {
    return sendMicroserviceRequest(this.client, 'playlist.add-song', {
      userId,
      playlistId,
      songId,
    });
  }

  async removeSongFromPlaylist(
    userId: string,
    playlistId: string,
    songId: string,
  ) {
    return sendMicroserviceRequest(this.client, 'playlist.remove-song', {
      userId,
      playlistId,
      songId,
    });
  }

  async getPlaylistDetail(userId: string, playlistId: string) {
    return sendMicroserviceRequest(this.client, 'playlist.get-detail', {
      userId,
      playlistId,
    });
  }

  async getMyPlaylists(userId: string) {
    return sendMicroserviceRequest(this.client, 'playlist.get-my-playlist', {
      userId,
    });
  }

  async getPublicPlaylists(
    page: number = 1,
    limit: number = 10,
    sortBy: 'created_at' | 'updated_at' = 'created_at',
    order: 'asc' | 'desc' = 'desc',
  ) {
    return sendMicroserviceRequest(this.client, 'playlist.get-public', {
      page,
      limit,
      sortBy,
      order,
    });
  }
}
