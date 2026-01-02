import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class SearchClient {
  private readonly logger = new Logger(SearchClient.name);

  constructor(
    @Inject('SEARCH_SERVICE') private searchServiceClient: ClientProxy,
  ) {}

  async indexAlbum(albumId: string, albumData: any): Promise<void> {
    try {
      this.searchServiceClient.emit('search.index.album', {
        id: albumId,
        ...albumData,
      });
    } catch (error) {
      this.logger.error(
        `Failed to index album ${albumId}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  async deleteAlbum(albumId: string): Promise<void> {
    try {
      this.searchServiceClient.emit('search.delete.album', {
        id: albumId,
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete album ${albumId}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }
}
