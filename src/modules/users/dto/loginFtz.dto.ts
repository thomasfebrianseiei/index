import { IsNotEmpty, IsString, IsDefined, IsEmail } from 'class-validator';
import { Trim } from '../helpers/trim.decorator';

export class UserValidationFantazieDto {
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email must not be empty' })
  @IsDefined({ message: 'email must be defined' })
  @IsEmail()
  @Trim()
  email: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password must not be empty' })
  @IsDefined({ message: 'password must be defined' })
  @Trim()
  password: string;

  @IsString({ message: 'partner_code must be a string' })
  @IsNotEmpty({ message: 'partner_code must not be empty' })
  @IsDefined({ message: 'partner_code must be defined' })
  @Trim()
  partner_code: string;

  @IsString({ message: 'user_id must be a string' })
  @IsNotEmpty({ message: 'user_id must not be empty' })
  @IsDefined({ message: 'user_id must be defined' })
  @Trim()
  user_id: string;
}
