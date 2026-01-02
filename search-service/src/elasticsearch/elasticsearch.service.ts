import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

export interface SearchResult {
  id: string;
  type: 'artist' | 'album' | 'playlist' | 'song';
  name?: string;
  title?: string;
  artist?: string;
  album?: string;
  description?: string;
  score: number;
}

@Injectable()
export class SearchElasticsearchService {
  private readonly logger = new Logger(SearchElasticsearchService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  /**
   * Index a song
   */
  async indexSong(id: string, data: any) {
    try {
      await this.elasticsearchService.index({
        index: 'songs',
        id,
        document: {
          title: data.title,
          artist: data.artist,
          album: data.album,
          duration: data.duration,
          cover_url: data.cover_url,
          type: 'song',
        },
      });
      this.logger.log(`Indexed song: ${id}`);
    } catch (error) {
      this.logger.error(`Error indexing song: ${error.message}`);
      throw error;
    }
  }

  /**
   * Index an artist
   */
  async indexArtist(id: string, data: any) {
    try {
      await this.elasticsearchService.index({
        index: 'artists',
        id,
        document: {
          name: data.displayName || data.name,
          bio: data.bio,
          avatar_url: data.avatarUrl || data.avatar_url,
          cover_image_url: data.coverImageUrl || data.cover_image_url,
          type: 'artist',
        },
      });
      this.logger.log(`Indexed artist: ${id}`);
    } catch (error) {
      this.logger.error(`Error indexing artist: ${error.message}`);
      throw error;
    }
  }

  /**
   * Index an album
   */
  async indexAlbum(id: string, data: any) {
    try {
      await this.elasticsearchService.index({
        index: 'albums',
        id,
        document: {
          title: data.title,
          description: data.description || '',
          release_date: data.releaseDate || data.release_date,
          cover_url: data.coverUrl || data.cover_url,
          type: 'album',
        },
      });
      this.logger.log(`Indexed album: ${id}`);
    } catch (error) {
      this.logger.error(`Error indexing album: ${error.message}`);
      throw error;
    }
  }

  /**
   * Index a playlist
   */
  async indexPlaylist(id: string, data: any) {
    try {
      await this.elasticsearchService.index({
        index: 'playlists',
        id,
        document: {
          name: data.title || data.name,
          description: data.description || '',
          cover_url: data.coverUrl || data.cover_url,
          is_public: data.isPublic !== undefined ? data.isPublic : true,
          type: 'playlist',
        },
      });
      this.logger.log(`Indexed playlist: ${id}`);
    } catch (error) {
      this.logger.error(`Error indexing playlist: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search across all indices
   */
  async search(
    query: string,
    from: number = 0,
    size: number = 20,
  ): Promise<SearchResult[]> {
    try {
      const searchBody: any = {
        from,
        size,
        query: {
          multi_match: {
            query,
            fields: [
              'title^2',
              'name^2',
              'artist^1.5',
              'album',
              'description',
              'bio',
            ],
            fuzziness: 'AUTO',
          },
        },
      };

      // Search in all indices at once
      const results: any = await this.elasticsearchService.search({
        index: 'songs,artists,albums,playlists',
        body: searchBody,
      } as any);

      return results.hits.hits.map((hit: any) => ({
        id: hit._id,
        type: hit._source.type,
        score: hit._score,
        ...hit._source,
      }));
    } catch (error) {
      this.logger.error(`Search error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search songs
   */
  async searchSongs(query: string, from: number = 0, size: number = 20) {
    try {
      const results: any = await this.elasticsearchService.search({
        index: 'songs',
        body: {
          from,
          size,
          query: {
            multi_match: {
              query,
              fields: ['title^2', 'artist^1.5', 'album'],
              fuzziness: 'AUTO',
            },
          },
        },
      } as any);

      const total =
        typeof results.hits.total === 'number'
          ? results.hits.total
          : results.hits.total?.value || 0;

      return {
        total,
        items: results.hits.hits.map((hit: any) => ({
          id: hit._id,
          score: hit._score,
          ...hit._source,
        })),
      };
    } catch (error) {
      this.logger.error(`Search songs error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search artists
   */
  async searchArtists(query: string, from: number = 0, size: number = 20) {
    try {
      const results: any = await this.elasticsearchService.search({
        index: 'artists',
        body: {
          from,
          size,
          query: {
            multi_match: {
              query,
              fields: ['name^2', 'bio'],
              fuzziness: 'AUTO',
            },
          },
        },
      } as any);

      const total =
        typeof results.hits.total === 'number'
          ? results.hits.total
          : results.hits.total?.value || 0;

      return {
        total,
        items: results.hits.hits.map((hit: any) => ({
          id: hit._id,
          score: hit._score,
          ...hit._source,
        })),
      };
    } catch (error) {
      this.logger.error(`Search artists error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search albums
   */
  async searchAlbums(query: string, from: number = 0, size: number = 20) {
    try {
      const results: any = await this.elasticsearchService.search({
        index: 'albums',
        body: {
          from,
          size,
          query: {
            multi_match: {
              query,
              fields: ['title^2', 'artist^1.5', 'description'],
              fuzziness: 'AUTO',
            },
          },
        },
      } as any);

      const total =
        typeof results.hits.total === 'number'
          ? results.hits.total
          : results.hits.total?.value || 0;

      return {
        total,
        items: results.hits.hits.map((hit: any) => ({
          id: hit._id,
          score: hit._score,
          ...hit._source,
        })),
      };
    } catch (error) {
      this.logger.error(`Search albums error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search playlists
   */
  async searchPlaylists(query: string, from: number = 0, size: number = 20) {
    try {
      const results: any = await this.elasticsearchService.search({
        index: 'playlists',
        body: {
          from,
          size,
          query: {
            multi_match: {
              query,
              fields: ['name^2', 'description', 'owner'],
              fuzziness: 'AUTO',
            },
          },
        },
      } as any);

      const total =
        typeof results.hits.total === 'number'
          ? results.hits.total
          : results.hits.total?.value || 0;

      return {
        total,
        items: results.hits.hits.map((hit: any) => ({
          id: hit._id,
          score: hit._score,
          ...hit._source,
        })),
      };
    } catch (error) {
      this.logger.error(`Search playlists error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a song from index
   */
  async deleteSong(id: string) {
    try {
      await this.elasticsearchService.delete({
        index: 'songs',
        id,
      });
      this.logger.log(`Deleted song: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting song: ${error.message}`);
    }
  }

  /**
   * Delete an artist from index
   */
  async deleteArtist(id: string) {
    try {
      await this.elasticsearchService.delete({
        index: 'artists',
        id,
      });
      this.logger.log(`Deleted artist: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting artist: ${error.message}`);
    }
  }

  /**
   * Delete an album from index
   */
  async deleteAlbum(id: string) {
    try {
      await this.elasticsearchService.delete({
        index: 'albums',
        id,
      });
      this.logger.log(`Deleted album: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting album: ${error.message}`);
    }
  }

  /**
   * Delete a playlist from index
   */
  async deletePlaylist(id: string) {
    try {
      await this.elasticsearchService.delete({
        index: 'playlists',
        id,
      });
      this.logger.log(`Deleted playlist: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting playlist: ${error.message}`);
    }
  }

  /**
   * Create indices with mappings
   */
  async initializeIndices() {
    try {
      // Songs index
      await this.createIndexIfNotExists('songs', {
        properties: {
          title: { type: 'text', analyzer: 'standard' },
          artist: { type: 'text', analyzer: 'standard' },
          album: { type: 'text', analyzer: 'standard' },
          duration: { type: 'integer' },
          cover_url: { type: 'keyword' },
          type: { type: 'keyword' },
        },
      });

      // Artists index
      await this.createIndexIfNotExists('artists', {
        properties: {
          name: { type: 'text', analyzer: 'standard' },
          bio: { type: 'text', analyzer: 'standard' },
          avatar_url: { type: 'keyword' },
          follower_count: { type: 'integer' },
          type: { type: 'keyword' },
        },
      });

      // Albums index
      await this.createIndexIfNotExists('albums', {
        properties: {
          title: { type: 'text', analyzer: 'standard' },
          artist: { type: 'text', analyzer: 'standard' },
          release_date: { type: 'date' },
          cover_url: { type: 'keyword' },
          description: { type: 'text', analyzer: 'standard' },
          song_count: { type: 'integer' },
          type: { type: 'keyword' },
        },
      });

      // Playlists index
      await this.createIndexIfNotExists('playlists', {
        properties: {
          name: { type: 'text', analyzer: 'standard' },
          description: { type: 'text', analyzer: 'standard' },
          owner: { type: 'text', analyzer: 'standard' },
          cover_url: { type: 'keyword' },
          is_public: { type: 'boolean' },
          song_count: { type: 'integer' },
          type: { type: 'keyword' },
        },
      });

      this.logger.log('Elasticsearch indices initialized');
    } catch (error) {
      this.logger.error(`Error initializing indices: ${error.message}`);
      throw error;
    }
  }

  /**
   * Helper method to create index if it doesn't exist
   */
  private async createIndexIfNotExists(index: string, mappings: any) {
    try {
      const exists: any = await this.elasticsearchService.indices.exists({
        index,
      } as any);

      if (!exists) {
        await this.elasticsearchService.indices.create({
          index,
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
          },
          mappings: {
            properties: mappings.properties,
          },
        } as any);
        this.logger.log(`Created index: ${index}`);
      }
    } catch (error) {
      this.logger.error(`Error creating index ${index}: ${error.message}`);
    }
  }
}
