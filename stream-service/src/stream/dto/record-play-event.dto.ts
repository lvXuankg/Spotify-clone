import { IsString, IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class RecordPlayEventDto {
  @IsUUID()
  songId: string;

  @IsInt()
  @Min(0)
  playedSeconds: number;
}
