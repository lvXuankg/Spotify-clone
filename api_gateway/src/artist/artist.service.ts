import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateArtistDto } from './dto/create-artist.dto';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(@Inject('ARTIST_SERVICE') private readonly client: ClientProxy) {}

  async createArtist(dto: CreateArtistDto) {
    return sendMicroserviceRequest(this.client, 'artist.create-artist', dto);
  }

  async updateArtist(id: string, dto: UpdateArtistDto) {
    return sendMicroserviceRequest(this.client, 'artist.update-artist', {
      id,
      ...dto,
    });
  }

  async deleteArtist(artistId: string) {
    return sendMicroserviceRequest(
      this.client,
      'artist.delete-artist',
      artistId,
    );
  }

  async getListArtist(page?: number, limit?: number) {
    return sendMicroserviceRequest(this.client, 'artist.get-list-artist', {
      page,
      limit,
    });
  }

  async getArtist(artistId: string) {
    return sendMicroserviceRequest(this.client, 'artist.get-detail-artist', {
      artistId,
    });
  }
}
