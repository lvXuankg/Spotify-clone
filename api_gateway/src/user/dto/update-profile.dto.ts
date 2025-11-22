import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsUrl,
  Matches,
  IsPhoneNumber,
} from 'class-validator';
import { validationMessages } from 'src/common/constants/validation-messages';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: validationMessages.isString('Tên') })
  @MinLength(2, { message: validationMessages.minLength('Tên', 2) })
  @MaxLength(50, { message: validationMessages.maxLength('Tên', 50) })
  name?: string;

  @IsOptional()
  @IsString({ message: validationMessages.isString('Username') })
  @MinLength(3, { message: validationMessages.minLength('Username', 3) })
  @MaxLength(30, { message: validationMessages.maxLength('Username', 30) })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Username chỉ chứa chữ, số, dấu gạch ngang và dấu gạch dưới',
  })
  username?: string;

  @IsOptional()
  @IsString({ message: validationMessages.isString('Bio') })
  @MaxLength(500, { message: validationMessages.maxLength('Bio', 500) })
  bio?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Facebook URL phải là URL hợp lệ' })
  facebookUrl?: string;

  @IsOptional()
  @IsPhoneNumber('VN', {
    message: 'Số điện thoại Zalo phải là số Việt Nam hợp lệ',
  })
  zaloPhone?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL phải là URL hợp lệ' })
  avatarUrl?: string;

  @IsOptional()
  @IsEmail({}, { message: validationMessages.isEmail })
  email?: string;
}
