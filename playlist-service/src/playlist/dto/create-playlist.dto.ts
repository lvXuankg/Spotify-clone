import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
