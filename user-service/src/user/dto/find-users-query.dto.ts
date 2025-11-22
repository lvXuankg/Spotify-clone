import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsIn,
  MinLength,
  MaxLength,
} from 'class-validator';
import { validationMessages } from 'src/common/constants/validation-messages';

export class FindUsersQueryDto {
  @IsString({ message: validationMessages.isString('text') })
  @MinLength(1, { message: validationMessages.minLength('text', 1) })
  @MaxLength(100, { message: validationMessages.maxLength('text', 100) })
  text: string;

  @IsOptional()
  @IsString({ message: validationMessages.isString('cursor') })
  cursor?: string;

  @IsOptional()
  @IsNumber({}, { message: validationMessages.isNumber('limit') })
  @Min(1, { message: validationMessages.min('limit', 1) })
  @Max(100, { message: validationMessages.max('limit', 100) })
  limit?: number = 10;

  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: validationMessages.isIn('order', ['asc', 'desc']),
  })
  order?: 'asc' | 'desc' = 'asc';
}

export class PaginatedUserDto {
  id: bigint;
  email: string;
  username: string;
  name: string | null;
  avatar_url: string | null;
}

export class FindUsersResponseDto {
  data: PaginatedUserDto[];
  pagination: {
    limit: number;
    hasNextPage: boolean;
    nextCursor: string | null;
    totalFetched: number;
  };
}
