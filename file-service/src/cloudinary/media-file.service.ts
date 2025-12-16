import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveMediaFileDto, MediaFileResponseDto } from './dto/media-file.dto';

@Injectable()
export class MediaFileService {
  private readonly logger = new Logger(MediaFileService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lưu metadata file vào database
   */
  async saveMediaFile(dto: SaveMediaFileDto): Promise<MediaFileResponseDto> {
    try {
      const mediaFile = await this.prisma.media_files.create({
        data: {
          public_id: dto.publicId,
          url: dto.url,
          resource_type: dto.resourceType,
          format: dto.format,
          size_bytes: dto.sizeBytes,
          uploaded_by: dto.uploadedBy,
        },
      });

      this.logger.log(
        `Media file saved: ${mediaFile.id} (${dto.publicId}) by user ${dto.uploadedBy}`,
      );

      return this.mapToResponse(mediaFile);
    } catch (error) {
      this.logger.error(`Failed to save media file: ${error.message}`);
      throw new BadRequestException(
        `Failed to save media file: ${error.message}`,
      );
    }
  }

  /**
   * Lấy thông tin file theo ID
   */
  async getMediaFile(id: string): Promise<MediaFileResponseDto> {
    try {
      const mediaFile = await this.prisma.media_files.findUnique({
        where: { id },
      });

      if (!mediaFile) {
        throw new BadRequestException(`Media file not found: ${id}`);
      }

      return this.mapToResponse(mediaFile);
    } catch (error) {
      this.logger.error(`Failed to get media file ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lấy file theo public_id (Cloudinary ID)
   */
  async getMediaFileByPublicId(
    publicId: string,
  ): Promise<MediaFileResponseDto | null> {
    try {
      const mediaFile = await this.prisma.media_files.findFirst({
        where: { public_id: publicId },
      });

      if (!mediaFile) {
        return null;
      }

      return this.mapToResponse(mediaFile);
    } catch (error) {
      this.logger.error(
        `Failed to get media file by public_id ${publicId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Lấy tất cả files của một user
   */
  async getUserMediaFiles(
    userId: string,
    skip = 0,
    take = 20,
  ): Promise<{ data: MediaFileResponseDto[]; total: number }> {
    try {
      const [mediaFiles, total] = await Promise.all([
        this.prisma.media_files.findMany({
          where: { uploaded_by: userId },
          skip,
          take,
          orderBy: { created_at: 'desc' },
        }),
        this.prisma.media_files.count({
          where: { uploaded_by: userId },
        }),
      ]);

      return {
        data: mediaFiles.map((file) => this.mapToResponse(file)),
        total,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get user media files for ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Xóa file khỏi database
   */
  async deleteMediaFile(id: string): Promise<void> {
    try {
      const mediaFile = await this.prisma.media_files.findUnique({
        where: { id },
      });

      if (!mediaFile) {
        throw new BadRequestException(`Media file not found: ${id}`);
      }

      await this.prisma.media_files.delete({
        where: { id },
      });

      this.logger.log(`Media file deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete media file ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Xóa file theo public_id (Cloudinary ID)
   */
  async deleteMediaFileByPublicId(publicId: string): Promise<boolean> {
    try {
      const result = await this.prisma.media_files.deleteMany({
        where: { public_id: publicId },
      });

      if (result.count > 0) {
        this.logger.log(`Media file deleted by public_id: ${publicId}`);
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(
        `Failed to delete media file by public_id ${publicId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Update metadata file
   */
  async updateMediaFile(
    id: string,
    data: Partial<SaveMediaFileDto>,
  ): Promise<MediaFileResponseDto> {
    try {
      const mediaFile = await this.prisma.media_files.update({
        where: { id },
        data: {
          ...(data.url && { url: data.url }),
          ...(data.format && { format: data.format }),
          ...(data.sizeBytes && { size_bytes: data.sizeBytes }),
        },
      });

      this.logger.log(`Media file updated: ${id}`);
      return this.mapToResponse(mediaFile);
    } catch (error) {
      this.logger.error(`Failed to update media file ${id}: ${error.message}`);
      throw error;
    }
  }

  private mapToResponse(mediaFile: any): MediaFileResponseDto {
    return {
      id: mediaFile.id,
      publicId: mediaFile.public_id,
      url: mediaFile.url,
      resourceType: mediaFile.resource_type,
      format: mediaFile.format,
      sizeBytes: mediaFile.size_bytes
        ? Number(mediaFile.size_bytes)
        : undefined,
      uploadedBy: mediaFile.uploaded_by,
      createdAt: mediaFile.created_at,
      updatedAt: mediaFile.updated_at,
    };
  }
}
