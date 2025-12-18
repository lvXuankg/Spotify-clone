import { Controller } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @MessagePattern('artist.create-artist')
  async createArtist(@Payload() payload: CreateArtistDto) {
    return this.artistService.create(payload);
  }

  @MessagePattern('artist.update-artist')
  async updateArtist(@Payload() payload: { id: string } & UpdateArtistDto) {
    const { id, ...updateData } = payload;
    return this.artistService.update(id, updateData);
  }

  @MessagePattern('artist.delete-artist')
  async deleteArtist(@Payload() artistId: string) {
    return this.artistService.delete(artistId);
  }

  @MessagePattern('artist.get-list-artist')
  async getArtists(@Payload() payload: { page: number; limit: number }) {
    return this.artistService.findAll(payload.page, payload.limit);
  }

  @MessagePattern('artist.get-detail-artist')
  async getArtist(@Payload() Payload: { artistId: string }) {
    return this.artistService.findOne(Payload.artistId);
  }
}
