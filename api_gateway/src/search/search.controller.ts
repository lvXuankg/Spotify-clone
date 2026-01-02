import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * Search all types (songs, artists, albums, playlists)
   * GET /search?q=query&from=0&size=20
   */
  @Get()
  async search(
    @Query('q') q: string,
    @Query('from') from: string = '0',
    @Query('size') size: string = '20',
  ) {
    return this.searchService.searchAll(q, parseInt(from), parseInt(size));
  }

  /**
   * Search only songs
   * GET /search/songs?q=query&from=0&size=20
   */
  @Get('songs')
  async searchSongs(
    @Query('q') q: string,
    @Query('from') from: string = '0',
    @Query('size') size: string = '20',
  ) {
    return this.searchService.searchSongs(q, parseInt(from), parseInt(size));
  }

  /**
   * Search only artists
   * GET /search/artists?q=query&from=0&size=20
   */
  @Get('artists')
  async searchArtists(
    @Query('q') q: string,
    @Query('from') from: string = '0',
    @Query('size') size: string = '20',
  ) {
    return this.searchService.searchArtists(q, parseInt(from), parseInt(size));
  }

  /**
   * Search only albums
   * GET /search/albums?q=query&from=0&size=20
   */
  @Get('albums')
  async searchAlbums(
    @Query('q') q: string,
    @Query('from') from: string = '0',
    @Query('size') size: string = '20',
  ) {
    return this.searchService.searchAlbums(q, parseInt(from), parseInt(size));
  }

  /**
   * Search only playlists
   * GET /search/playlists?q=query&from=0&size=20
   */
  @Get('playlists')
  async searchPlaylists(
    @Query('q') q: string,
    @Query('from') from: string = '0',
    @Query('size') size: string = '20',
  ) {
    return this.searchService.searchPlaylists(
      q,
      parseInt(from),
      parseInt(size),
    );
  }
}
