import { IsString, IsUUID, IsInt, Min, IsOptional, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class RecordPlayEventDto {
  @IsUUID()
  songId: string;

  @IsInt()
  @Min(0)
  playedSeconds: number;
}

export class GetPlayHistoryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class GetTopSongsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  period?: 'day' | 'week' | 'month' | 'all';
}
