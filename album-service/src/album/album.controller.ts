import { Controller } from '@nestjs/common';
import { AlbumService } from './album.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @MessagePattern('album.create-album')
  async createAlbum(@Payload() payload: { artistId: string } & CreateAlbumDto) {
    const { artistId, ...dto } = payload;
    return this.albumService.create(artistId, dto);
  }

  @MessagePattern('album.update-album')
  async updateAlbum(@Payload() payload: { id: string } & UpdateAlbumDto) {
    const { id, ...dto } = payload;
    return this.albumService.update(id, dto);
  }

  @MessagePattern('album.get-list-album')
  async getAlbums(
    @Payload() payload: { artistId: string; page: number; limit: number },
  ) {
    return this.albumService.findByArtist(
      payload.artistId,
      payload.page,
      payload.limit,
    );
  }

  @MessagePattern('album.delete-album')
  async deleteAlbum(@Payload() payload: { id: string }) {
    return this.albumService.delete(payload.id);
  }

  @MessagePattern('album.get-album')
  async getAlbum(@Payload() payload: { id: string }) {
    return this.albumService.findOne(payload.id);
  }
}
