import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsBoolean,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  durationSeconds: number;

  @IsString()
  @IsNotEmpty()
  audioUrl: string;

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
