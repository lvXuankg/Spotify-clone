import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CloudinaryService } from './cloudinary.service';
import { MediaFileService } from './media-file.service';
import { GeneratePresignedUrlDto } from './dto/presigned-url.dto';
import { UploadFileMetadataDto } from './dto/upload-response.dto';

@Controller()
export class CloudinaryController {
  private readonly logger = new Logger(CloudinaryController.name);

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly mediaFileService: MediaFileService,
  ) {}

  @MessagePattern('file.generate-presigned-url')
  async generatePresignedUrlMicroservice(
    @Payload() dto: GeneratePresignedUrlDto,
  ) {
    this.logger.log(
      `[Microservice] Generating presigned URL for folder: ${dto.folder}`,
    );
    return this.cloudinaryService.generatePresignedUrl(dto);
  }

  @MessagePattern('file.save-metadata')
  async saveMetadataMicroservice(
    @Payload() payload: { userId: string; metadata: UploadFileMetadataDto },
  ) {
    this.logger.log(
      `[Microservice] Saving metadata for ${payload.metadata.publicId} by user ${payload.userId}`,
    );
    return this.cloudinaryService.saveUploadMetadataFromWebhook(
      payload.metadata,
      payload.userId,
    );
  }

  @MessagePattern('file.verify-upload')
  async verifyUploadMicroservice(@Payload() payload: { publicId: string }) {
    this.logger.log(`[Microservice] Verifying upload for: ${payload.publicId}`);
    return this.cloudinaryService.verifyUpload(payload.publicId);
  }

  @MessagePattern('file.get-info')
  async getFileInfoMicroservice(@Payload() payload: { publicId: string }) {
    this.logger.log(
      `[Microservice] Getting file info for: ${payload.publicId}`,
    );
    return this.cloudinaryService.getFileInfo(payload.publicId);
  }

  @MessagePattern('file.get-user-files')
  async getUserMediaFilesMicroservice(
    @Payload()
    payload: {
      userId: string;
      skip?: number;
      take?: number;
    },
  ) {
    this.logger.log(
      `[Microservice] Getting media files for user: ${payload.userId}`,
    );
    return this.mediaFileService.getUserMediaFiles(
      payload.userId,
      payload.skip || 0,
      payload.take || 20,
    );
  }

  @MessagePattern('file.get-by-id')
  async getMediaFileMicroservice(@Payload() payload: { id: string }) {
    this.logger.log(`[Microservice] Getting media file: ${payload.id}`);
    return this.mediaFileService.getMediaFile(payload.id);
  }

  @MessagePattern('file.delete')
  async deleteFileMicroservice(
    @Payload() payload: { publicId: string; userId?: string },
  ) {
    this.logger.log(`[Microservice] Deleting file: ${payload.publicId}`);

    // Delete from Cloudinary
    await this.cloudinaryService.deleteFile(payload.publicId, payload.userId);

    // Delete from database
    await this.mediaFileService.deleteMediaFileByPublicId(
      payload.publicId,
      payload.userId,
    );

    return {
      success: true,
      message: 'File deleted from Cloudinary and database',
    };
  }

  @MessagePattern('file.delete-multiple')
  async deleteMultipleFilesMicroservice(
    @Payload() payload: { publicIds: string[] },
  ) {
    this.logger.log(
      `[Microservice] Deleting ${payload.publicIds.length} files`,
    );

    // Delete from Cloudinary
    await this.cloudinaryService.deleteMultipleFiles(payload.publicIds);

    // Delete from database
    for (const publicId of payload.publicIds) {
      await this.mediaFileService.deleteMediaFileByPublicId(publicId);
    }

    return {
      success: true,
      message: `Deleted ${payload.publicIds.length} files from Cloudinary and database`,
    };
  }
}
