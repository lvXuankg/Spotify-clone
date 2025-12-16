import { IsString, IsNumber, IsOptional } from 'class-validator';

export class PresignedUrlResponseDto {
  uploadUrl: string;
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId?: string;
  expiresAt: number;
  eager?: string;
}

/**
 * Frontend sends this after upload to Cloudinary
 * Contains metadata returned by Cloudinary in upload response
 */
export class UploadFileMetadataDto {
  @IsString()
  publicId: string;

  @IsString()
  url: string;

  @IsString()
  secureUrl: string;

  @IsString()
  format: string;

  @IsString()
  resourceType: string;

  @IsNumber()
  bytes: number;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  createdAt?: string;
}

export class FileInfoDto {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  createdAt?: string;
}

export class UploadResponseDto {
  success: boolean;
  data?: FileInfoDto;
  error?: string;
}

export class DeleteResponseDto {
  success: boolean;
  message: string;
}
