import {
  IsString,
  IsOptional,
  IsUUID,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { validationMessages } from 'src/common/constants/validation-messages';

export class CreateArtistDto {
  @IsOptional()
  @IsUUID('4', { message: 'User ID phải là UUID hợp lệ' })
  @Type(() => String)
  userId?: string;

  @IsString({ message: validationMessages.isString('Tên hiển thị') })
  @MinLength(1, { message: validationMessages.minLength('Tên hiển thị', 1) })
  @MaxLength(100, {
    message: validationMessages.maxLength('Tên hiển thị', 100),
  })
  displayName: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL phải là URL hợp lệ' })
  avatarUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Cover image URL phải là URL hợp lệ' })
  coverImageUrl?: string;

  @IsOptional()
  @IsString({ message: validationMessages.isString('Bio') })
  @MaxLength(500, { message: validationMessages.maxLength('Bio', 500) })
  bio?: string;
}
