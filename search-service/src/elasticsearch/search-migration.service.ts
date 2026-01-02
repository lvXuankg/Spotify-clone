import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchMigrationService {
  private readonly logger = new Logger(SearchMigrationService.name);

  constructor(
    private elasticsearchService: ElasticsearchService,
    private prisma: PrismaService,
  ) {}

  /**
   * Migrate all songs from database to Elasticsearch
   */
  async migrateSongs(
    batchSize: number = 100,
  ): Promise<{ total: number; indexed: number }> {
    try {
      this.logger.log('Starting songs migration...');

      const count = await this.prisma.songs.count();
      let indexed = 0;

      for (let skip = 0; skip < count; skip += batchSize) {
        const songs = await this.prisma.songs.findMany({
          skip,
          take: batchSize,
          include: {
            albums: { select: { id: true, title: true, cover_url: true } },
            song_artists: {
              include: { artists: { select: { display_name: true } } },
            },
          },
        });

        for (const song of songs) {
          try {
            const artistName =
              song.song_artists?.[0]?.artists?.display_name || '';
            const albumTitle = song.albums?.title || '';
            const albumId = song.albums?.id || '';
            const coverUrl = song.albums?.cover_url || '';

            await this.elasticsearchService.index({
              index: 'songs',
              id: song.id,
              document: {
                title: song.title,
                artist: artistName,
                album: albumTitle,
                album_id: albumId,
                duration: song.duration_seconds,
                audio_url: song.audio_url || '',
                cover_url: coverUrl,
                type: 'song',
              },
            });
            indexed++;
          } catch (error) {
            this.logger.error(
              `Error indexing song ${song.id}: ${error.message}`,
            );
          }
        }

        this.logger.log(
          `Migrated ${Math.min(skip + batchSize, count)}/${count} songs`,
        );
      }

      this.logger.log(
        `✅ Songs migration completed: ${indexed}/${count} indexed`,
      );
      return { total: count, indexed };
    } catch (error) {
      this.logger.error(`Songs migration failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Migrate all artists from database to Elasticsearch
   */
  async migrateArtists(
    batchSize: number = 100,
  ): Promise<{ total: number; indexed: number }> {
    try {
      this.logger.log('Starting artists migration...');

      const count = await this.prisma.artists.count();
      let indexed = 0;

      for (let skip = 0; skip < count; skip += batchSize) {
        const artists = await this.prisma.artists.findMany({
          skip,
          take: batchSize,
        });

        for (const artist of artists) {
          try {
            await this.elasticsearchService.index({
              index: 'artists',
              id: artist.id,
              document: {
                name: artist.display_name,
                bio: artist.bio || '',
                avatar_url: artist.avatar_url,
                cover_image_url: artist.cover_image_url,
                type: 'artist',
              },
            });
            indexed++;
          } catch (error) {
            this.logger.error(
              `Error indexing artist ${artist.id}: ${error.message}`,
            );
          }
        }

        this.logger.log(
          `Migrated ${Math.min(skip + batchSize, count)}/${count} artists`,
        );
      }

      this.logger.log(
        `✅ Artists migration completed: ${indexed}/${count} indexed`,
      );
      return { total: count, indexed };
    } catch (error) {
      this.logger.error(`Artists migration failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Migrate all albums from database to Elasticsearch
   */
  async migrateAlbums(
    batchSize: number = 100,
  ): Promise<{ total: number; indexed: number }> {
    try {
      this.logger.log('Starting albums migration...');

      const count = await this.prisma.albums.count();
      let indexed = 0;

      for (let skip = 0; skip < count; skip += batchSize) {
        const albums = await this.prisma.albums.findMany({
          skip,
          take: batchSize,
          include: {
            artists: { select: { display_name: true } },
          },
        });

        for (const album of albums) {
          try {
            await this.elasticsearchService.index({
              index: 'albums',
              id: album.id,
              document: {
                title: album.title,
                artist: album.artists?.display_name || '',
                release_date: album.release_date,
                cover_url: album.cover_url,
                description: '',
                type: 'album',
              },
            });
            indexed++;
          } catch (error) {
            this.logger.error(
              `Error indexing album ${album.id}: ${error.message}`,
            );
          }
        }

        this.logger.log(
          `Migrated ${Math.min(skip + batchSize, count)}/${count} albums`,
        );
      }

      this.logger.log(
        `✅ Albums migration completed: ${indexed}/${count} indexed`,
      );
      return { total: count, indexed };
    } catch (error) {
      this.logger.error(`Albums migration failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Migrate all playlists from database to Elasticsearch
   */
  async migratePlaylists(
    batchSize: number = 100,
  ): Promise<{ total: number; indexed: number }> {
    try {
      this.logger.log('Starting playlists migration...');

      const count = await this.prisma.playlists.count();
      let indexed = 0;

      for (let skip = 0; skip < count; skip += batchSize) {
        const playlists = await this.prisma.playlists.findMany({
          skip,
          take: batchSize,
        });

        for (const playlist of playlists) {
          try {
            await this.elasticsearchService.index({
              index: 'playlists',
              id: playlist.id,
              document: {
                name: playlist.title,
                description: playlist.description || '',
                cover_url: playlist.cover_url,
                is_public: playlist.is_public,
                type: 'playlist',
              },
            });
            indexed++;
          } catch (error) {
            this.logger.error(
              `Error indexing playlist ${playlist.id}: ${error.message}`,
            );
          }
        }

        this.logger.log(
          `Migrated ${Math.min(skip + batchSize, count)}/${count} playlists`,
        );
      }

      this.logger.log(
        `✅ Playlists migration completed: ${indexed}/${count} indexed`,
      );
      return { total: count, indexed };
    } catch (error) {
      this.logger.error(`Playlists migration failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Migrate all data (songs, artists, albums, playlists)
   */
  async migrateAll(batchSize: number = 100): Promise<{
    songs: { total: number; indexed: number };
    artists: { total: number; indexed: number };
    albums: { total: number; indexed: number };
    playlists: { total: number; indexed: number };
    startTime: Date;
    endTime: Date;
  }> {
    const startTime = new Date();
    this.logger.log('🚀 Starting complete data migration to Elasticsearch...');

    try {
      const songs = await this.migrateSongs(batchSize);
      const artists = await this.migrateArtists(batchSize);
      const albums = await this.migrateAlbums(batchSize);
      const playlists = await this.migratePlaylists(batchSize);

      const endTime = new Date();
      const duration = (endTime.getTime() - startTime.getTime()) / 1000;

      this.logger.log(`
╔════════════════════════════════════════════╗
║      Migration Summary - COMPLETED ✅      ║
╠════════════════════════════════════════════╣
║ Songs:     ${songs.indexed}/${songs.total} indexed
║ Artists:   ${artists.indexed}/${artists.total} indexed
║ Albums:    ${albums.indexed}/${albums.total} indexed
║ Playlists: ${playlists.indexed}/${playlists.total} indexed
╠════════════════════════════════════════════╣
║ Total Indexed: ${songs.indexed + artists.indexed + albums.indexed + playlists.indexed}
║ Duration: ${duration.toFixed(2)}s
╚════════════════════════════════════════════╝
      `);

      return {
        songs,
        artists,
        albums,
        playlists,
        startTime,
        endTime,
      };
    } catch (error) {
      this.logger.error(`Complete migration failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clear all Elasticsearch indices
   */
  async clearIndices(): Promise<void> {
    try {
      const indices = ['songs', 'artists', 'albums', 'playlists'];

      for (const index of indices) {
        try {
          await this.elasticsearchService.indices.delete({ index } as any);
          this.logger.log(`Deleted index: ${index}`);
        } catch (error) {
          if (error.meta?.statusCode !== 404) {
            throw error;
          }
          this.logger.log(`Index ${index} does not exist`);
        }
      }

      this.logger.log('✅ All indices cleared');
    } catch (error) {
      this.logger.error(`Clear indices failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Re-initialize and migrate (clear + reinitialize + migrate)
   */
  async reinitializeAndMigrate(batchSize: number = 100): Promise<{
    songs: { total: number; indexed: number };
    artists: { total: number; indexed: number };
    albums: { total: number; indexed: number };
    playlists: { total: number; indexed: number };
    startTime: Date;
    endTime: Date;
  }> {
    this.logger.log('🔄 Starting re-initialization and migration...');

    // Note: Initialize indices is done in elasticsearch.service.ts
    // Here we just clear and migrate
    await this.clearIndices();

    return this.migrateAll(batchSize);
  }
}
