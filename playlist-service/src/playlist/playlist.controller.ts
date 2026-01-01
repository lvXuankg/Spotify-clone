import { Controller } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @MessagePattern('playlist.create')
  async createPlaylist(
    @Payload() payload: { userId: string } & CreatePlaylistDto,
  ) {
    const { userId, ...dto } = payload;
    return this.playlistService.create(userId, dto);
  }

  @MessagePattern('playlist.update')
  async updatePlaylist(
    @Payload()
    payload: { userId: string; playlistId: string } & UpdatePlaylistDto,
  ) {
    const { userId, playlistId, ...dto } = payload;
    return this.playlistService.update(userId, playlistId, dto);
  }

  @MessagePattern('playlist.delete')
  async deletePlaylist(
    @Payload() payload: { userId: string; playlistId: string },
  ) {
    return this.playlistService.delete(payload.playlistId, payload.userId);
  }

  @MessagePattern('playlist.add-song')
  async addSongToPlaylist(
    @Payload()
    payload: {
      userId: string;
      playlistId: string;
      songId: string;
    },
  ) {
    const { userId, playlistId, songId } = payload;
    return this.playlistService.addSongToPlaylist(userId, playlistId, songId);
  }

  @MessagePattern('playlist.get-detail')
  async getPlaylist(
    @Payload() payload: { userId: string; playlistId: string },
  ) {
    return this.playlistService.getOnePlaylist(
      payload.userId,
      payload.playlistId,
    );
  }

  @MessagePattern('playlist.get-my-playlist')
  async getMyPlaylists(@Payload() payload: { userId: string }) {
    return this.playlistService.getMyPlaylists(payload.userId);
  }
}
