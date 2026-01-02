import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export interface SearchResult {
  type: 'song' | 'artist' | 'album' | 'playlist';
  id: string;
  title?: string;
  name?: string;
  artist?: string;
  description?: string;
  cover_url?: string;
  score?: number;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(@Inject('SEARCH_SERVICE') private searchClient: ClientProxy) {}

  async searchAll(q: string, from: number = 0, size: number = 20) {
    try {
      const results = await lastValueFrom(
        this.searchClient.send('search.all', { q, from, size }),
      );
      return {
        total: results.total || 0,
        results: results.results || [],
      };
    } catch (error) {
      this.logger.error(`Search error: ${error.message}`);
      return { total: 0, results: [] };
    }
  }

  async searchSongs(q: string, from: number = 0, size: number = 20) {
    try {
      const results = await lastValueFrom(
        this.searchClient.send('search.songs', { q, from, size }),
      );
      return {
        total: results.total || 0,
        items: results.items || [],
      };
    } catch (error) {
      this.logger.error(`Search songs error: ${error.message}`);
      return { total: 0, items: [] };
    }
  }

  async searchArtists(q: string, from: number = 0, size: number = 20) {
    try {
      const results = await lastValueFrom(
        this.searchClient.send('search.artists', { q, from, size }),
      );
      return {
        total: results.total || 0,
        items: results.items || [],
      };
    } catch (error) {
      this.logger.error(`Search artists error: ${error.message}`);
      return { total: 0, items: [] };
    }
  }

  async searchAlbums(q: string, from: number = 0, size: number = 20) {
    try {
      const results = await lastValueFrom(
        this.searchClient.send('search.albums', { q, from, size }),
      );
      return {
        total: results.total || 0,
        items: results.items || [],
      };
    } catch (error) {
      this.logger.error(`Search albums error: ${error.message}`);
      return { total: 0, items: [] };
    }
  }

  async searchPlaylists(q: string, from: number = 0, size: number = 20) {
    try {
      const results = await lastValueFrom(
        this.searchClient.send('search.playlists', { q, from, size }),
      );
      return {
        total: results.total || 0,
        items: results.items || [],
      };
    } catch (error) {
      this.logger.error(`Search playlists error: ${error.message}`);
      return { total: 0, items: [] };
    }
  }
}
