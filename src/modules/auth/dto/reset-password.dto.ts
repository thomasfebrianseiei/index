
// src/auth/dto/reset-password.dto.ts
import { IsString, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { Type } from 'class-transformer';

export class ForgotPasswordDto {
    @IsString()
    @IsNotEmpty()
    email: string;

}

export class ResetPasswordDto {
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
    @IsNotEmpty()
    newPassword: string;
}

