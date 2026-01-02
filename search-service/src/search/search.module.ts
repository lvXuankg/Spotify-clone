import { Module } from '@nestjs/common';
import { SearchElasticsearchController } from '../elasticsearch/elasticsearch.controller';
import { SearchElasticsearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  imports: [SearchElasticsearchModule],
  controllers: [SearchElasticsearchController],
})
export class SearchModule {}
