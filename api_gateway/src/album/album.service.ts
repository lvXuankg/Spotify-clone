import { Inject, Injectable } from '@nestjs/common';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AlbumService {
  constructor(@Inject('ALBUM_SERVICE') private readonly client: ClientProxy) {}

  async createAlbum(artistId: string, dto: CreateAlbumDto) {
    return sendMicroserviceRequest(this.client, 'album.create-album', {
      artistId,
      ...dto,
    });
  }

  async updateAlbum(id: string, dto: UpdateAlbumDto) {
    return sendMicroserviceRequest(this.client, 'album.update-album', {
      id,
      ...dto,
    });
  }

  async getAlbums(artistId: string, page: number = 1, limit: number = 10) {
    return sendMicroserviceRequest(this.client, 'album.get-list-album', {
      artistId,
      page,
      limit,
    });
  }

  async getAlbum(albumId: string) {
    return sendMicroserviceRequest(this.client, 'album.get-album', {
      id: albumId,
    });
  }

  async deleteAlbum(id: string) {
    return sendMicroserviceRequest(this.client, 'album.delete-album', {
      id,
    });
  }

  async getAllAlbums(
    page: number = 1,
    limit: number = 10,
    sortBy: 'created_at' | 'updated_at' = 'created_at',
    order: 'asc' | 'desc' = 'desc',
  ) {
    return sendMicroserviceRequest(this.client, 'album.get-all', {
      page,
      limit,
      sortBy,
      order,
    });
  }
}
