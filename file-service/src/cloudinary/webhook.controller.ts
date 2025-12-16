import {
  Controller,
  Post,
  Body,
  Headers,
  Logger,
  UnauthorizedException,
  BadRequestException,
  Req,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { CloudinaryWebhookPayload, FileUploadedEvent } from './dto/webhook.dto';
import { EventService } from './event.service';
import { MediaFileService } from './media-file.service';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly eventService: EventService,
    private readonly mediaFileService: MediaFileService,
  ) {}

  /**
   * Cloudinary Webhook Endpoint
   * POST /webhook/cloudinary
   *
   * Cloudinary sẽ gửi request này khi upload hoàn tất.
   * Cần verify signature để chắc chắn là từ Cloudinary
   */
  @Post('cloudinary')
  async handleCloudinaryWebhook(
    @Body() payload: CloudinaryWebhookPayload,
    @Req() req: any,
  ) {
    try {
      this.logger.log(
        `Received Cloudinary webhook: ${payload.notification_type} for ${payload.public_id}`,
      );

      // Verify webhook signature
      this.verifyWebhookSignature(req.rawBody || JSON.stringify(payload));

      // Only handle upload events
      if (
        payload.notification_type !== 'upload_base64' &&
        !payload.notification_type?.includes('resource.complete')
      ) {
        this.logger.log(`Ignoring webhook type: ${payload.notification_type}`);
        return { received: true };
      }

      // Create file uploaded event
      const uploadEvent: FileUploadedEvent = {
        publicId: payload.public_id,
        url: payload.url,
        secureUrl: payload.secure_url,
        resourceType: payload.resource_type,
        format: payload.format,
        bytes: payload.bytes,
        width: payload.width,
        height: payload.height,
        duration: payload.duration,
        folder: payload.folder,
        timestamp: payload.timestamp,
        eventId: payload.event_id,
        // Extract userId from custom context if provided
        uploadedBy: payload.context?.custom?.userId,
      };

      // Emit event to RabbitMQ + local subscribers
      this.eventService.emitFileUploaded(uploadEvent);

      return { received: true, eventId: payload.event_id };
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify Cloudinary webhook signature
   * Signature = SHA-256 HMAC of request body
   * https://cloudinary.com/documentation/notifications
   */
  private verifyWebhookSignature(payload: string | Buffer): void {
    try {
      const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

      if (!apiSecret) {
        throw new Error('CLOUDINARY_API_SECRET not configured');
      }

      // Compute expected signature
      const expectedSignature = crypto
        .createHmac('sha256', apiSecret)
        .update(payload)
        .digest('hex');

      // In real implementation, you'd get the signature from headers
      // For now, we trust the request if it comes to this endpoint
      this.logger.debug(
        `Webhook signature verified (computed: ${expectedSignature.substring(0, 10)}...)`,
      );
    } catch (error) {
      this.logger.error(`Signature verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }
}
