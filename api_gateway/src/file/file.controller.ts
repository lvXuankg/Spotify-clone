import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FileService } from './file.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GeneratePresignedUrlDto } from './dto/presigned-url.dto';
import { UploadFileMetadataDto } from './dto/upload-response.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('presignedUrl')
  @UseGuards(JwtAuthGuard)
  async getPresignedUrl(@Body() dto: GeneratePresignedUrlDto) {
    return this.fileService.getPresignedUrl(dto);
  }

  @Post('saveMetadata')
  @UseGuards(JwtAuthGuard)
  async saveMetadata(@Request() req: any, @Body() dto: UploadFileMetadataDto) {
    return this.fileService.saveMetadata(req.user.userId, dto);
  }
}
