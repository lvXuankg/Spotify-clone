import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import {
  GeneratePresignedUrlDto,
  FolderType,
  ResourceType,
} from './dto/presigned-url.dto';
import {
  PresignedUrlResponseDto,
  UploadResponseDto,
  DeleteResponseDto,
} from './dto/upload-response.dto';
import { MediaFileService } from './media-file.service';
import { SaveMediaFileDto } from './dto/media-file.dto';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mediaFileService: MediaFileService,
  ) {
    // Config Cloudinary SDK
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  /**
   * Generate presigned URL cho frontend upload trực tiếp lên Cloudinary
   */
  generatePresignedUrl(dto: GeneratePresignedUrlDto): PresignedUrlResponseDto {
    try {
      const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
      const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
      const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

      const timestamp = Math.round(Date.now() / 1000);
      const expiresAt = timestamp + (dto.expiresIn || 600);
      const publicId =
        dto.publicId ||
        `${dto.folder}/${uuidv4().replace(/-/g, '').substring(0, 16)}`;

      // Parameters to sign
      const paramsToSign: Record<string, any> = {
        timestamp,
        folder: dto.folder,
        public_id: publicId,
      };

      // Add eager transformations for images
      if (dto.resourceType === ResourceType.IMAGE) {
        const eager = 'w_300,h_300,c_fill|w_640,h_640,c_fill';
        paramsToSign.eager = eager;
        paramsToSign.eager_async = true;
      }

      // Generate signature
      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        apiSecret!,
      );

      const resourceType = dto.resourceType || ResourceType.AUTO;
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      this.logger.log(
        `Generated presigned URL for folder: ${dto.folder}, expires in ${dto.expiresIn}s`,
      );

      const response: PresignedUrlResponseDto = {
        uploadUrl,
        signature,
        timestamp,
        apiKey: apiKey!,
        cloudName: cloudName!,
        folder: dto.folder,
        publicId,
        expiresAt,
      };

      // Include eager transformations in response if present
      if (dto.resourceType === ResourceType.IMAGE) {
        response.eager = 'w_300,h_300,c_fill|w_640,h_640,c_fill';
      }

      return response;
    } catch (error) {
      this.logger.error(`Generate presigned URL failed: ${error.message}`);
      throw new BadRequestException(
        `Failed to generate presigned URL: ${error.message}`,
      );
    }
  }

  /**
   * Verify that upload was successful (DEPRECATED)
   * ❌ No longer calls cloudinary.api.resource() to avoid "Too Many Requests" errors
   * ✅ Now just confirms entry exists in database
   */
  async verifyUpload(publicId: string): Promise<UploadResponseDto> {
    try {
      // Check if file exists in database
      const mediaFile =
        await this.mediaFileService.getMediaFileByPublicId(publicId);

      if (!mediaFile) {
        return {
          success: false,
          error: 'File not found in database',
        };
      }

      return {
        success: true,
        data: {
          publicId: mediaFile.publicId,
          url: mediaFile.url,
          secureUrl: mediaFile.url,
          format: mediaFile.format || '',
          resourceType: mediaFile.resourceType,
          bytes: mediaFile.sizeBytes || 0,
          createdAt: mediaFile.createdAt.toISOString(),
        },
      };
    } catch (error) {
      this.logger.error(
        `Verify upload failed for ${publicId}: ${error.message}`,
      );
      return {
        success: false,
        error: 'Verification failed',
      };
    }
  }

  /**
   * Delete file from Cloudinary
   */
  async deleteFile(publicId: string): Promise<DeleteResponseDto> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === 'ok') {
        this.logger.log(`File deleted successfully: ${publicId}`);
        return {
          success: true,
          message: 'File deleted successfully',
        };
      }

      return {
        success: false,
        message: 'File not found or already deleted',
      };
    } catch (error) {
      this.logger.error(`Delete file failed for ${publicId}: ${error.message}`);
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Delete multiple files
   */
  async deleteMultipleFiles(publicIds: string[]): Promise<DeleteResponseDto> {
    try {
      const result = await cloudinary.api.delete_resources(publicIds);

      this.logger.log(
        `Deleted ${Object.keys(result.deleted).length} files: ${publicIds.join(', ')}`,
      );

      return {
        success: true,
        message: `Deleted ${Object.keys(result.deleted).length} files successfully`,
      };
    } catch (error) {
      this.logger.error(
        `Bulk delete failed for ${publicIds.length} files: ${error.message}`,
      );
      throw new BadRequestException(`Failed to delete files: ${error.message}`);
    }
  }

  /**
   * Get file information from Cloudinary
   */
  async getFileInfo(publicId: string): Promise<UploadResponseDto> {
    try {
      const result = await cloudinary.api.resource(publicId);

      return {
        success: true,
        data: {
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          format: result.format,
          resourceType: result.resource_type,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          duration: result.duration,
          createdAt: result.created_at,
        },
      };
    } catch (error) {
      this.logger.error(
        `Get file info failed for ${publicId}: ${error.message}`,
      );
      throw new BadRequestException(`File not found: ${publicId}`);
    }
  }

  /**
   * Save upload metadata to database
   * ❌ NO LONGER calls cloudinary.api.resource() - avoiding "Too Many Requests" errors
   * ✅ Directly uses metadata from webhook (already verified via signature)
   *
   * @param fileMetadata - File data from Cloudinary webhook or frontend
   * @param uploadedBy - User ID who uploaded the file
   */
  async saveUploadMetadataFromWebhook(
    fileMetadata: {
      publicId: string;
      url: string;
      secureUrl: string;
      format: string;
      resourceType: string;
      bytes?: number;
      width?: number;
      height?: number;
      duration?: number;
    },
    uploadedBy: string,
  ): Promise<UploadResponseDto> {
    try {
      // Save to database directly (trust webhook data - signature already verified)
      const saveDto: SaveMediaFileDto = {
        publicId: fileMetadata.publicId,
        url: fileMetadata.secureUrl || fileMetadata.url,
        resourceType: fileMetadata.resourceType,
        format: fileMetadata.format,
        sizeBytes: fileMetadata.bytes,
        uploadedBy,
      };

      const mediaFile = await this.mediaFileService.saveMediaFile(saveDto);

      this.logger.log(
        `Upload metadata saved for ${fileMetadata.publicId} by user ${uploadedBy}`,
      );

      return {
        success: true,
        data: {
          publicId: mediaFile.publicId,
          url: mediaFile.url,
          secureUrl: mediaFile.url,
          format: mediaFile.format || '',
          resourceType: mediaFile.resourceType,
          bytes: mediaFile.sizeBytes || 0,
          width: fileMetadata.width,
          height: fileMetadata.height,
          duration: fileMetadata.duration,
          createdAt: mediaFile.createdAt.toISOString(),
        },
      };
    } catch (error) {
      this.logger.error(`Save upload metadata failed: ${error.message}`);
      throw new BadRequestException(
        `Failed to save upload metadata: ${error.message}`,
      );
    }
  }

  /**
   * Legacy method - kept for backward compatibility
   * @deprecated Use saveUploadMetadataFromWebhook instead
   */
  async saveUploadMetadata(
    publicId: string,
    uploadedBy: string,
  ): Promise<UploadResponseDto> {
    this.logger.warn(
      'saveUploadMetadata is deprecated - use saveUploadMetadataFromWebhook',
    );

    // For backward compatibility - just return from DB if exists
    try {
      const mediaFile =
        await this.mediaFileService.getMediaFileByPublicId(publicId);

      if (!mediaFile) {
        return {
          success: false,
          error:
            'File not found - please use saveUploadMetadataFromWebhook instead',
        };
      }

      return {
        success: true,
        data: {
          publicId: mediaFile.publicId,
          url: mediaFile.url,
          secureUrl: mediaFile.url,
          format: mediaFile.format || '',
          resourceType: mediaFile.resourceType,
          bytes: mediaFile.sizeBytes || 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
