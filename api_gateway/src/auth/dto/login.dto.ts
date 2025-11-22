import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { validationMessages } from 'src/common/constants/validation-messages';
export class LoginDto {
  @IsEmail({}, { message: validationMessages.isEmail })
  @IsNotEmpty({ message: validationMessages.isNotEmpty('email') })
  email: string;

  @IsString({ message: validationMessages.isString('mật khẩu') })
  @MinLength(8, { message: validationMessages.minLength('mật khẩu', 8) })
  password: string;
}
