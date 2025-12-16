import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { MediaFileService } from './media-file.service';
import { WebhookController } from './webhook.controller';
import { EventService } from './event.service';
import { FileUploadedListener } from './file-uploaded.listener';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    // RabbitMQ client for publishing events
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'file_service_events',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [CloudinaryController, WebhookController],
  providers: [
    CloudinaryService,
    MediaFileService,
    EventService,
    FileUploadedListener,
  ],
  exports: [CloudinaryService, MediaFileService, EventService],
})
export class CloudinaryModule {}
