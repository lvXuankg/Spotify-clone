import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSongDto } from './dto/create-song.dto';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { UpdateSongDto } from './dto/update-song.dto';
import { extractPublicIdFromUrl } from 'src/common/utils/cloudinary.util';

@Injectable()
export class SongService {
  constructor(
    @Inject('SONG_SERVICE') private readonly client: ClientProxy,
    @Inject('FILE_SERVICE') private readonly file: ClientProxy,
  ) {}

  async createSong(albumId: string, dto: CreateSongDto) {
    return sendMicroserviceRequest(this.client, 'song.create', {
      albumId,
      ...dto,
    });
  }

  async updateSong(songId: string, dto: UpdateSongDto) {
    return sendMicroserviceRequest(this.client, 'song.update', {
      id: songId,
      ...dto,
    });
  }

  async findAllSongs(albumId: string) {
    return sendMicroserviceRequest(this.client, 'song.findAll', { albumId });
  }

  async getSong(songId: string) {
    return sendMicroserviceRequest(this.client, 'song.findOne', { id: songId });
  }

  async deleteSong(songId: string) {
    const song = await sendMicroserviceRequest(this.client, 'song.findOne', {
      id: songId,
    });

    if (!song) {
      throw new Error('Không tìm thấy bài hát');
    }

    if (song.audio_url) {
      const publicId = extractPublicIdFromUrl(song.audio_url);

      if (publicId) {
        try {
          await sendMicroserviceRequest(this.file, 'file.delete', {
            publicId,
          });
        } catch (err) {
          console.error('Không xóa được file Cloudinary:', err);
          // log + continue
        }
      }
    }

    const deletedSong = await sendMicroserviceRequest(
      this.client,
      'song.delete',
      { id: songId },
    );

    return deletedSong;
  }

  async incrementPlayCount(songId: string) {
    return sendMicroserviceRequest(this.client, 'song.incrementPlayCount', {
      id: songId,
    });
  }

  async searchSongByTitle(keyword: string, page: number, limit: number) {
    return sendMicroserviceRequest(this.client, 'song.search-by-title', {
      keyword,
      page,
      limit,
    });
  }
}
