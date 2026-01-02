import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SearchClient } from './search.client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SEARCH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://admin:1234@localhost:5672',
          ],
          queue: 'search-queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [SearchClient],
  exports: [SearchClient],
})
export class SearchModule {}
