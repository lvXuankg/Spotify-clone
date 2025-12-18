import {
  IsUUID,
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { validationMessages } from 'src/common/constants/validation-messages';

export enum AlbumType {
  SINGLE = 'SINGLE',
  EP = 'EP',
  ALBUM = 'ALBUM',
}

export class CreateAlbumDto {
  @IsNotEmpty({ message: validationMessages.isNotEmpty('Tiêu đề') })
  @IsString({ message: validationMessages.isString('Tiêu đề') })
  title: string;

  @IsOptional()
  @IsString({ message: validationMessages.isString('Cover URL') })
  coverUrl?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: validationMessages.isDateString('Ngày phát hành') },
  )
  releaseDate?: string;

  @IsOptional()
  @IsEnum(AlbumType, {
    message: validationMessages.isEnum('Loại album', Object.values(AlbumType)),
  })
  type?: AlbumType = AlbumType.SINGLE;
}
