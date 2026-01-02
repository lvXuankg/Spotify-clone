import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class SearchClient {
  private readonly logger = new Logger(SearchClient.name);

  constructor(
    @Inject('SEARCH_SERVICE') private searchServiceClient: ClientProxy,
  ) {}

  async indexArtist(artistId: string, artistData: any): Promise<void> {
    try {
      this.searchServiceClient.emit('search.index.artist', {
        id: artistId,
        ...artistData,
      });
    } catch (error) {
      this.logger.error(
        `Failed to index artist ${artistId}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  async deleteArtist(artistId: string): Promise<void> {
    try {
      this.searchServiceClient.emit('search.delete.artist', {
        id: artistId,
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete artist ${artistId}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }
}
