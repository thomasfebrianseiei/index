import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UserDetailDto {
  @IsOptional()
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  dob: string;

  @IsOptional()
  @IsString()
  place_of_birth: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  profile_img: string;

  @IsOptional()
  @IsString()
  id_card_image: string;

  @IsOptional()
  @IsString()
  selfie_img: string;
}

export enum GenderTypeEnum {
  men = 'laki-laki',
  female = 'perempuan',
}

export class EditPersonalDataDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  dob: string;

  @IsOptional()
  @IsString()
  place_of_birth: string;

  @IsOptional()
  @IsEnum(GenderTypeEnum, { message: 'Tipe Jenis Kelamin tidak valid' })
  gender: GenderTypeEnum;
}
export class EditContactDto {
  @IsOptional()
  @IsPhoneNumber('ID', { message: 'Nomor telepon tidak valid' })
  phone: string;

  @IsOptional()
  @IsEmail({}, { message: 'email tidak valid' })
  email: string;
}
