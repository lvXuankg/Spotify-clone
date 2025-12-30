import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsPositive,
} from 'class-validator';

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  durationSeconds?: number;

  @IsString()
  @IsOptional()
  audioUrl?: string;

  @IsInt()
  @IsOptional()
  trackNumber?: number;

  @IsInt()
  @IsOptional()
  discNumber?: number;

  @IsBoolean()
  @IsOptional()
  isExplicit?: boolean;

  @IsInt()
  @IsOptional()
  bitrate?: number;
}
