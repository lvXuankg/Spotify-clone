import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Role } from 'src/common/enums/role.enum';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPlaylist(@Request() req: any, @Body() dto: CreatePlaylistDto) {
    return this.playlistService.createPlaylist(req.user.userId, dto);
  }

  @Patch(':playlistId')
  @UseGuards(JwtAuthGuard)
  async updatePlaylist(
    @Request() req: any,
    @Param('playlistId') playlistId: string,
    @Body() dto: UpdatePlaylistDto,
  ) {
    return this.playlistService.updatePlaylist(
      req.user.userId,
      playlistId,
      dto,
    );
  }

  @Delete(':playlistId')
  @UseGuards(JwtAuthGuard)
  async deletePlaylist(
    @Request() req: any,
    @Param('playlistId') playlistId: string,
  ) {
    return this.playlistService.deletePlaylist(
      req.user.role !== Role.ADMIN ? req.user.userId : '',
      playlistId,
    );
  }

  @Post(':playlistId/song/:songId')
  @UseGuards(JwtAuthGuard)
  async addSongToPlaylist(
    @Request() req: any,
    @Param('playlistId') playlistId: string,
    @Param('songId') songId: string,
  ) {
    return this.playlistService.addSongToPlaylist(
      req.user.userId,
      playlistId,
      songId,
    );
  }

  @Delete(':playlistId/song/:songId')
  @UseGuards(JwtAuthGuard)
  async removeSongFromPlaylist(
    @Request() req: any,
    @Param('playlistId') playlistId: string,
    @Param('songId') songId: string,
  ) {
    return this.playlistService.removeSongFromPlaylist(
      req.user.userId,
      playlistId,
      songId,
    );
  }

  @Get('get-my-playlists')
  @UseGuards(JwtAuthGuard)
  async getMyPlaylist(@Request() req: any) {
    return this.playlistService.getMyPlaylists(req.user.userId);
  }

  @Get('public')
  async getPublicPlaylists(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: 'created_at' | 'updated_at' = 'created_at',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    return this.playlistService.getPublicPlaylists(page, limit, sortBy, order);
  }

  @Get(':playlistId')
  @UseGuards(JwtAuthGuard)
  async getPlaylistDetail(
    @Request() req: any,
    @Param('playlistId') playlistId: string,
  ) {
    const userId = req.user.userId;
    return this.playlistService.getPlaylistDetail(userId, playlistId);
  }
}
