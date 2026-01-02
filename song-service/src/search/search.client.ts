import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SearchClient {
  private readonly logger = new Logger(SearchClient.name);

  constructor(@Inject('SEARCH_SERVICE') private client: ClientProxy) {}

  async indexSong(id: string, data: any) {
    try {
      const result = await lastValueFrom(
        this.client.emit('search.index.song', { id, ...data }),
      );
      this.logger.log(`Indexed song: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error indexing song ${id}: ${error.message}`);
      // Don't throw - search indexing shouldn't block primary operation
    }
  }

  async deleteSong(id: string) {
    try {
      const result = await lastValueFrom(
        this.client.emit('search.delete.song', { id }),
      );
      this.logger.log(`Deleted song from search index: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error deleting song ${id} from search: ${error.message}`,
      );
      // Don't throw - search deletion shouldn't block primary operation
    }
  }
}
