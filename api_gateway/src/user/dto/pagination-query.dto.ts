import { IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';
import { validationMessages } from 'src/common/constants/validation-messages';

/**
 * DTO for pagination query (followers/followings)
 */
export class PaginationQueryDto {
  @IsOptional()
  @IsString({ message: validationMessages.isString('cursor') })
  cursor?: string;

  @IsOptional()
  @IsNumber({}, { message: validationMessages.isNumber('limit') })
  @Min(1, { message: validationMessages.min('limit', 1) })
  @Max(100, { message: validationMessages.max('limit', 100) })
  limit?: number = 10;
}
