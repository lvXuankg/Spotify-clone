import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { validationMessages } from 'src/common/constants/validation-messages';
export class RefreshDto {
  @IsString({ message: validationMessages.isString('id người dùng') })
  @IsNotEmpty({ message: validationMessages.isNotEmpty('id người dùng') })
  userId: string;
}
