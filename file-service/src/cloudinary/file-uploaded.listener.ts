import { Injectable, Logger, Optional } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FileUploadedEvent, FileProcessedEvent } from './dto/webhook.dto';
import { MediaFileService } from './media-file.service';
import { CloudinaryService } from './cloudinary.service';
import { EventService } from './event.service';

@Injectable()
export class FileUploadedListener {
  private readonly logger = new Logger(FileUploadedListener.name);

  constructor(
    private readonly mediaFileService: MediaFileService,
    private readonly cloudinaryService: CloudinaryService,
    @Optional()
    private readonly eventService?: EventService,
  ) {}

  /**
   * Listen to file.uploaded event from webhook
   * Saves file metadata without calling Cloudinary API
   */
  @OnEvent('file.uploaded')
  async handleFileUploaded(event: FileUploadedEvent) {
    try {
      this.logger.log(`Processing uploaded file: ${event.publicId}`);

      // If uploadedBy is provided, save to database immediately
      if (event.uploadedBy) {
        // Use the optimized method that doesn't call Cloudinary API
        const result =
          await this.cloudinaryService.saveUploadMetadataFromWebhook(
            {
              publicId: event.publicId,
              url: event.url,
              secureUrl: event.secureUrl,
              format: event.format,
              resourceType: event.resourceType,
              bytes: event.bytes,
              width: event.width,
              height: event.height,
              duration: event.duration,
            },
            event.uploadedBy,
          );

        if (result.success) {
          this.logger.log(
            `Saved file to database: ${event.publicId} for user ${event.uploadedBy}`,
          );

          // Emit file.processed event (if EventService is available)
          if (this.eventService) {
            const processedEvent: FileProcessedEvent = {
              databaseId: result.data?.publicId || event.publicId,
              publicId: event.publicId,
              uploadedBy: event.uploadedBy,
              timestamp: Date.now(),
            };

            this.eventService.emitFileProcessed(processedEvent);
          }
        }
      } else {
        this.logger.warn(
          `File uploaded but no uploadedBy info: ${event.publicId}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to process file.uploaded event: ${error.message}`,
      );
      // Don't throw - allow the webhook to complete
    }
  }

  /**
   * Listen to file.deleted event
   */
  @OnEvent('file.deleted')
  async handleFileDeleted(event: any) {
    try {
      this.logger.log(`Processing deleted file: ${event.publicId}`);
      // Additional cleanup if needed
    } catch (error) {
      this.logger.error(
        `Failed to process file.deleted event: ${error.message}`,
      );
    }
  }
}
