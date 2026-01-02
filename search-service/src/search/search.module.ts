import { Module } from '@nestjs/common';
import { SearchElasticsearchController } from '../elasticsearch/elasticsearch.controller';
import { SearchElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { SearchElasticsearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  imports: [SearchElasticsearchModule],
  controllers: [SearchElasticsearchController],
  providers: [SearchElasticsearchService],
  exports: [SearchElasticsearchService],
})
export class SearchModule {}
