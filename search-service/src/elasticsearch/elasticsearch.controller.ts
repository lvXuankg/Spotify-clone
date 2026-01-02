import { Controller, Get, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SearchElasticsearchService } from './elasticsearch.service';

@Controller('search')
export class SearchElasticsearchController {
  constructor(private readonly searchService: SearchElasticsearchService) {}

  /**
   * REST API: Search all
   */
  @Get()
  async search(
    @Query('q') query: string,
    @Query('from') from: string = '0',
    @Query('size') size: string = '20',
  ) {
    const results = await this.searchService.search(
      query,
      parseInt(from),
      parseInt(size),
    );
    return {
      total: results.length,
      results,
    };
  }

  /**
   * REST API: Search songs
   */
  @Get('songs')
  async searchSongs(
    @Query('q') query: string,
    @Query('from') from: string = '0',
    @Query('size') size: string = '20',
  ) {
    return this.searchService.searchSongs(
      query,
      parseInt(from),
      parseInt(size),
    );
  }

  /**
   * REST API: Search artists
   */
  @Get('artists')
  async searchArtists(
    @Query('q') query: string,
    @Query('from') from: string = '0',
    @Query('size') size: string = '20',
  ) {
    return this.searchService.searchArtists(
      query,
      parseInt(from),
      parseInt(size),
    );
  }

  /**
   * REST API: Search albums
   */
  @Get('albums')
  async searchAlbums(
    @Query('q') query: string,
    @Query('from') from: string = '0',
    @Query('size') size: string = '20',
  ) {
    return this.searchService.searchAlbums(
      query,
      parseInt(from),
      parseInt(size),
    );
  }

  /**
   * REST API: Search playlists
   */
  @Get('playlists')
  async searchPlaylists(
    @Query('q') query: string,
    @Query('from') from: string = '0',
    @Query('size') size: string = '20',
  ) {
    return this.searchService.searchPlaylists(
      query,
      parseInt(from),
      parseInt(size),
    );
  }

  /**
   * Microservice: Index song
   */
  @MessagePattern('search.index.song')
  async indexSong(@Payload() data: any) {
    await this.searchService.indexSong(data.id, data);
    return { success: true };
  }

  /**
   * Microservice: Index artist
   */
  @MessagePattern('search.index.artist')
  async indexArtist(@Payload() data: any) {
    await this.searchService.indexArtist(data.id, data);
    return { success: true };
  }

  /**
   * Microservice: Index album
   */
  @MessagePattern('search.index.album')
  async indexAlbum(@Payload() data: any) {
    await this.searchService.indexAlbum(data.id, data);
    return { success: true };
  }

  /**
   * Microservice: Index playlist
   */
  @MessagePattern('search.index.playlist')
  async indexPlaylist(@Payload() data: any) {
    await this.searchService.indexPlaylist(data.id, data);
    return { success: true };
  }

  /**
   * Microservice: Delete song
   */
  @MessagePattern('search.delete.song')
  async deleteSong(@Payload() data: any) {
    await this.searchService.deleteSong(data.id);
    return { success: true };
  }

  /**
   * Microservice: Delete artist
   */
  @MessagePattern('search.delete.artist')
  async deleteArtist(@Payload() data: any) {
    await this.searchService.deleteArtist(data.id);
    return { success: true };
  }

  /**
   * Microservice: Delete album
   */
  @MessagePattern('search.delete.album')
  async deleteAlbum(@Payload() data: any) {
    await this.searchService.deleteAlbum(data.id);
    return { success: true };
  }

  /**
   * Microservice: Delete playlist
   */
  @MessagePattern('search.delete.playlist')
  async deletePlaylist(@Payload() data: any) {
    await this.searchService.deletePlaylist(data.id);
    return { success: true };
  }

  /**
   * RPC: Search all (for API Gateway)
   */
  @MessagePattern('search.all')
  async rpcSearchAll(@Payload() data: any) {
    const results = await this.searchService.search(
      data.q,
      data.from || 0,
      data.size || 20,
    );
    return {
      total: results.length,
      results,
    };
  }

  /**
   * RPC: Search songs (for API Gateway)
   */
  @MessagePattern('search.songs')
  async rpcSearchSongs(@Payload() data: any) {
    return this.searchService.searchSongs(
      data.q,
      data.from || 0,
      data.size || 20,
    );
  }

  /**
   * RPC: Search artists (for API Gateway)
   */
  @MessagePattern('search.artists')
  async rpcSearchArtists(@Payload() data: any) {
    return this.searchService.searchArtists(
      data.q,
      data.from || 0,
      data.size || 20,
    );
  }

  /**
   * RPC: Search albums (for API Gateway)
   */
  @MessagePattern('search.albums')
  async rpcSearchAlbums(@Payload() data: any) {
    return this.searchService.searchAlbums(
      data.q,
      data.from || 0,
      data.size || 20,
    );
  }

  /**
   * RPC: Search playlists (for API Gateway)
   */
  @MessagePattern('search.playlists')
  async rpcSearchPlaylists(@Payload() data: any) {
    return this.searchService.searchPlaylists(
      data.q,
      data.from || 0,
      data.size || 20,
    );
  }
}
