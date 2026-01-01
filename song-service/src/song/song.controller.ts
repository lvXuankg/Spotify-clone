import { Controller } from '@nestjs/common';
import { SongService } from './song.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @MessagePattern('song.create')
  async create(@Payload() payload: { albumId: string } & CreateSongDto) {
    const { albumId, ...dto } = payload;
    return this.songService.create(albumId, dto);
  }

  @MessagePattern('song.findAll')
  async findAll(@Payload() payload: { albumId: string }) {
    return this.songService.findAll(payload.albumId);
  }

  @MessagePattern('song.findOne')
  async findOne(@Payload() payload: { id: string }) {
    return this.songService.findOne(payload.id);
  }

  @MessagePattern('song.update')
  async update(@Payload() payload: { id: string } & UpdateSongDto) {
    const { id, ...dto } = payload;
    return this.songService.update(id, dto);
  }

  @MessagePattern('song.delete')
  async delete(@Payload() payload: { id: string }) {
    return this.songService.delete(payload.id);
  }

  @MessagePattern('song.incrementPlayCount')
  async incrementPlayCount(@Payload() payload: { id: string }) {
    return this.songService.incrementPlayCount(payload.id);
  }

  @MessagePattern('song.search-by-title')
  async searchByTitle(
    @Payload() payload: { keyword: string; page: number; limit: number },
  ) {
    return this.songService.searchByTitle(
      payload.keyword,
      payload.page,
      payload.limit,
    );
  }
}
