import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class SaveMediaFileDto {
  @IsString()
  publicId: string;

  @IsString()
  url: string;

  @IsString()
  resourceType: string;

  @IsString()
  @IsOptional()
  format?: string;

  @IsNumber()
  @IsOptional()
  sizeBytes?: number;

  @IsUUID()
  uploadedBy: string;

  @IsString()
  @IsOptional()
  secureUrl?: string;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  duration?: number;
}

export class MediaFileResponseDto {
  id: string;
  publicId: string;
  url: string;
  resourceType: string;
  format?: string;
  sizeBytes?: number;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
