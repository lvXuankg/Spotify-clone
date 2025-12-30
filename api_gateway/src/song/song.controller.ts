import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SongService } from './song.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post(':albumId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createSong(
    @Body() dto: CreateSongDto,
    @Param('albumId') albumId: string,
  ) {
    return this.songService.createSong(albumId, dto);
  }

  @Get('album/:albumId')
  async findAllSongs(@Param('albumId') albumId: string) {
    return this.songService.findAllSongs(albumId);
  }

  @Get(':songId')
  async getSong(@Param('songId') songId: string) {
    return this.songService.getSong(songId);
  }

  @Patch(':songId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateSong(
    @Body() dto: UpdateSongDto,
    @Param('songId') songId: string,
  ) {
    return this.songService.updateSong(songId, dto);
  }

  @Delete(':songId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteSong(@Param('songId') songId: string) {
    return this.songService.deleteSong(songId);
  }
}
