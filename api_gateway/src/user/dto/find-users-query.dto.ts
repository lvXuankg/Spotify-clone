import {
  IsString,
  IsOptional,
  IsNumberString,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { validationMessages } from 'src/common/constants/validation-messages';

export class FindUsersQueryDto {
  @IsString({ message: validationMessages.isString('text') })
  text: string;

  @IsOptional()
  @IsNumberString({}, { message: validationMessages.isNumberString('Cursor') })
  cursor?: string;

  @IsOptional()
  @IsNumberString({}, { message: validationMessages.isNumberString('Limit') })
  limit?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: validationMessages.isIn('Order', ['asc', 'desc']),
  })
  order?: 'asc' | 'desc';
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
