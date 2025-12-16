import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export enum FolderType {
  TRACKS = 'spotify/tracks',
  COVERS = 'spotify/covers',
  AVATARS = 'spotify/avatars',
  PLAYLISTS = 'spotify/playlists',
}

export enum ResourceType {
  IMAGE = 'image',
  VIDEO = 'video',
  RAW = 'raw',
  AUTO = 'auto',
}

export class GeneratePresignedUrlDto {
  @IsEnum(FolderType)
  folder: FolderType;

  @IsOptional()
  @IsEnum(ResourceType)
  resourceType?: ResourceType = ResourceType.AUTO;
}
