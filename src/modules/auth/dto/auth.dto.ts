import { IsNotEmpty, IsStrongPassword } from 'class-validator';



export class changePasswordDto {

    @IsStrongPassword({}, {
        message(validationArguments) {
            const { minLength, minLowercase, minUppercase, minNumbers, minSymbols } = validationArguments.constraints[0]
            return `oldPassword harus memiliki setidaknya ${minLowercase} huruf kecil, ${minUppercase} huruf besar, ${minNumbers} angka, ${minSymbols} simbol, dan sedikitnya ${minLength} karakter`
        },
    })
    @IsNotEmpty()
    oldPassword: string;

    @IsStrongPassword({}, {
        message(validationArguments) {
            const { minLength, minLowercase, minUppercase, minNumbers, minSymbols } = validationArguments.constraints[0]
            return `newPassword harus memiliki setidaknya ${minLowercase} huruf kecil, ${minUppercase} huruf besar, ${minNumbers} angka, ${minSymbols} simbol, dan sedikitnya ${minLength} karakter`
        },
    })
    @IsNotEmpty()
    newPassword: string;
}
