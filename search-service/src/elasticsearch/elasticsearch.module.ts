import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchElasticsearchService } from './elasticsearch.service';
import { SearchMigrationService } from './search-migration.service';
import { SearchMigrationController } from './search-migration.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    }),
    PrismaModule,
  ],
  providers: [SearchElasticsearchService, SearchMigrationService],
  controllers: [SearchMigrationController],
  exports: [SearchElasticsearchService, SearchMigrationService],
})
export class SearchElasticsearchModule {}
