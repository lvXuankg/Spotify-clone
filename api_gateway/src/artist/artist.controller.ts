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
import { ArtistService } from './artist.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createArtist(@Body() data: CreateArtistDto) {
    return this.artistService.createArtist(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateArtist(@Param('id') id: string, @Body() data: UpdateArtistDto) {
    return this.artistService.updateArtist(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteArtist(@Param('id') id: string) {
    return this.artistService.deleteArtist(id);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getListArtists(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.artistService.getListArtist(page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getArtist(@Param('id') id: string) {
    return this.artistService.getArtist(id);
  }
}
