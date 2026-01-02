import { Controller, Post, Body, Logger } from '@nestjs/common';
import { SearchMigrationService } from './search-migration.service';

@Controller('migration')
export class SearchMigrationController {
  private readonly logger = new Logger(SearchMigrationController.name);

  constructor(private readonly migrationService: SearchMigrationService) {}

  /**
   * POST /migration/songs - Migrate songs data
   */
  @Post('songs')
  async migrateSongs(@Body() { batchSize }: { batchSize?: number } = {}) {
    this.logger.log('Received migration request for songs');
    return this.migrationService.migrateSongs(batchSize || 100);
  }

  /**
   * POST /migration/artists - Migrate artists data
   */
  @Post('artists')
  async migrateArtists(@Body() { batchSize }: { batchSize?: number } = {}) {
    this.logger.log('Received migration request for artists');
    return this.migrationService.migrateArtists(batchSize || 100);
  }

  /**
   * POST /migration/albums - Migrate albums data
   */
  @Post('albums')
  async migrateAlbums(@Body() { batchSize }: { batchSize?: number } = {}) {
    this.logger.log('Received migration request for albums');
    return this.migrationService.migrateAlbums(batchSize || 100);
  }

  /**
   * POST /migration/playlists - Migrate playlists data
   */
  @Post('playlists')
  async migratePlaylists(@Body() { batchSize }: { batchSize?: number } = {}) {
    this.logger.log('Received migration request for playlists');
    return this.migrationService.migratePlaylists(batchSize || 100);
  }

  /**
   * POST /migration/all - Migrate all data
   */
  @Post('all')
  async migrateAll(@Body() { batchSize }: { batchSize?: number } = {}) {
    this.logger.log('Received migration request for all data');
    return this.migrationService.migrateAll(batchSize || 100);
  }

  /**
   * POST /migration/reinitialize - Clear indices and migrate all data
   */
  @Post('reinitialize')
  async reinitializeAndMigrate(
    @Body() { batchSize }: { batchSize?: number } = {},
  ) {
    this.logger.log('Received re-initialization and migration request');
    return this.migrationService.reinitializeAndMigrate(batchSize || 100);
  }

  /**
   * POST /migration/clear - Clear all indices (CAUTION!)
   */
  @Post('clear')
  async clearIndices() {
    this.logger.warn('⚠️  Clearing all Elasticsearch indices!');
    await this.migrationService.clearIndices();
    return { message: 'All indices cleared' };
  }
}
