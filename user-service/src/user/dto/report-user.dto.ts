import { IsString, MaxLength } from 'class-validator';
import { validationMessages } from 'src/common/constants/validation-messages';

export class ReportUserDto {
  @IsString({ message: validationMessages.isString('Lý do báo cáo') })
  @MaxLength(1000, {
    message: validationMessages.maxLength('Lý do báo cáo', 1000),
  })
  reason: string;
}
