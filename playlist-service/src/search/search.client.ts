import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class SearchClient {
  private readonly logger = new Logger(SearchClient.name);

  constructor(
    @Inject('SEARCH_SERVICE') private searchServiceClient: ClientProxy,
  ) {}

  async indexPlaylist(playlistId: string, playlistData: any): Promise<void> {
    try {
      this.searchServiceClient.emit('search.index.playlist', {
        id: playlistId,
        ...playlistData,
      });
    } catch (error) {
      this.logger.error(
        `Failed to index playlist ${playlistId}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    try {
      this.searchServiceClient.emit('search.delete.playlist', {
        id: playlistId,
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete playlist ${playlistId}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }
}
