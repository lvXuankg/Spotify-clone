import { IsString, IsOptional, MaxLength } from 'class-validator';
import { validationMessages } from 'src/common/constants/validation-messages';

export class BlockUserDto {
  @IsString({ message: validationMessages.isString('Lý do chặn') })
  @MaxLength(500, { message: validationMessages.maxLength('Lý do chặn', 500) })
  reason: string;
}
