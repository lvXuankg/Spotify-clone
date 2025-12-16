import { Injectable, Logger, Inject, Optional } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { FileUploadedEvent, FileProcessedEvent } from './dto/webhook.dto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Optional()
    @Inject('RABBITMQ_SERVICE')
    private readonly rabbitMqClient?: ClientProxy,
  ) {}

  /**
   * Emit file.uploaded event
   * Local event + RabbitMQ message
   */
  emitFileUploaded(event: FileUploadedEvent): void {
    try {
      // Emit local event (for subscribers in same service)
      this.eventEmitter.emit('file.uploaded', event);
      this.logger.log(
        `Emitted local event: file.uploaded for ${event.publicId}`,
      );

      // Send to RabbitMQ for other services
      if (this.rabbitMqClient) {
        this.rabbitMqClient.emit('file.uploaded', event).subscribe({
          next: () => {
            this.logger.log(
              `Published to RabbitMQ: file.uploaded for ${event.publicId}`,
            );
          },
          error: (err) => {
            this.logger.error(`Failed to publish to RabbitMQ: ${err.message}`);
          },
        });
      }
    } catch (error) {
      this.logger.error(`Failed to emit file.uploaded event: ${error.message}`);
      throw error;
    }
  }

  /**
   * Emit file.processed event
   * Sent after metadata is saved to database
   */
  emitFileProcessed(event: FileProcessedEvent): void {
    try {
      // Emit local event
      this.eventEmitter.emit('file.processed', event);
      this.logger.log(
        `Emitted local event: file.processed for ${event.publicId}`,
      );

      // Send to RabbitMQ
      if (this.rabbitMqClient) {
        this.rabbitMqClient.emit('file.processed', event).subscribe({
          next: () => {
            this.logger.log(
              `Published to RabbitMQ: file.processed for ${event.publicId}`,
            );
          },
          error: (err) => {
            this.logger.error(
              `Failed to publish file.processed to RabbitMQ: ${err.message}`,
            );
          },
        });
      }
    } catch (error) {
      this.logger.error(
        `Failed to emit file.processed event: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Emit file.deleted event
   */
  emitFileDeleted(publicId: string): void {
    try {
      const event = { publicId, timestamp: Date.now() };

      this.eventEmitter.emit('file.deleted', event);
      this.logger.log(`Emitted local event: file.deleted for ${publicId}`);

      if (this.rabbitMqClient) {
        this.rabbitMqClient.emit('file.deleted', event).subscribe({
          next: () => {
            this.logger.log(
              `Published to RabbitMQ: file.deleted for ${publicId}`,
            );
          },
          error: (err) => {
            this.logger.error(
              `Failed to publish file.deleted to RabbitMQ: ${err.message}`,
            );
          },
        });
      }
    } catch (error) {
      this.logger.error(`Failed to emit file.deleted event: ${error.message}`);
      throw error;
    }
  }
}
