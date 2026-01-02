import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchElasticsearchService } from './elasticsearch.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    }),
  ],
  providers: [SearchElasticsearchService],
  exports: [SearchElasticsearchService],
})
export class SearchElasticsearchModule {}
