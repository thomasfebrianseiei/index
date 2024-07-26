import {
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsStrongPassword,
  IsPhoneNumber,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'email tidak valid' })
  email: string;

  @IsStrongPassword(
    {},
    {
      message(validationArguments) {
        const {
          minLength,
          minLowercase,
          minUppercase,
          minNumbers,
          minSymbols,
        } = validationArguments.constraints[0];
        return `Password harus memiliki setidaknya ${minLowercase} huruf kecil, ${minUppercase} huruf besar, ${minNumbers} angka, ${minSymbols} simbol, dan sedikitnya ${minLength} karakter`;
      },
    },
  )
  @IsOptional()
  password: string;

  @IsOptional()
  @IsPhoneNumber('ID', { message: 'Nomor telepon tidak valid' })
  phone: string;

  @IsOptional()
  @IsBoolean()
  is_valid: boolean;
}

export class getAllUserDto {
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  pageSize: number;

  @IsOptional()
  @IsString()
  search?: string;
}

export class UserEditDto {
  @IsOptional()
  username: string;

  @IsOptional()
  @IsEmail({}, { message: 'email tidak valid' })
  email: string;

  @IsOptional()
  @IsPhoneNumber('ID', { message: 'Nomor telepon tidak valid' })
  phone: string;
}

export class UserValidationDto {
  @IsOptional()
  is_valid: true;
}
