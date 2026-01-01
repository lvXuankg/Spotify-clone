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
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createAlbum(@Param('id') id: string, @Body() dto: CreateAlbumDto) {
    return this.albumService.createAlbum(id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateAlbum(@Param('id') id: string, @Body() dto: UpdateAlbumDto) {
    return this.albumService.updateAlbum(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteAlbum(@Param('id') id: string) {
    return this.albumService.deleteAlbum(id);
  }

  @Get('list/:id')
  @UseGuards(JwtAuthGuard)
  async getAlbums(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.albumService.getAlbums(id, page, limit);
  }

  @Get()
  async getAllAlbums(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: 'created_at' | 'updated_at' = 'created_at',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    return this.albumService.getAllAlbums(page, limit, sortBy, order);
  }

  @Get(':albumId')
  @UseGuards(JwtAuthGuard)
  async getAlbum(@Param('albumId') albumId: string) {
    return this.albumService.getAlbum(albumId);
  }
}
