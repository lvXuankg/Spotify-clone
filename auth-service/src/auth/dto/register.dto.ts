import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { validationMessages } from 'src/common/constants/validation-messages';
export class RegisterDto {
  @IsEmail({}, { message: validationMessages.isEmail })
  @IsNotEmpty({ message: validationMessages.isNotEmpty('email') })
  email: string;

  @IsString()
  @MinLength(8, { message: validationMessages.minLength('mật khẩu', 8) })
  password: string;
}
