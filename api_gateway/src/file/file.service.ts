import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { GeneratePresignedUrlDto } from './dto/presigned-url.dto';
import { UploadFileMetadataDto } from './dto/upload-response.dto';

@Injectable()
export class FileService {
  constructor(@Inject('FILE_SERVICE') private readonly client: ClientProxy) {}

  async getPresignedUrl(dto: GeneratePresignedUrlDto) {
    return sendMicroserviceRequest(
      this.client,
      'file.generate-presigned-url',
      dto,
    );
  }

  async saveMetadata(userId: string, metadata: UploadFileMetadataDto) {
    return sendMicroserviceRequest(this.client, 'file.save-metadata', {
      userId,
      metadata,
    });
  }
}
