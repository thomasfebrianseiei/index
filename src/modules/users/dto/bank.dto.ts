import { IsString, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBankDto {
    @IsUUID()
    @IsOptional()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    bank_id: string;

    @IsString()
    @IsNotEmpty()
    bank_name: string;

    @IsString()
    @IsNotEmpty()
    account_num: string;

    @IsString()
    @IsNotEmpty()
    owner: string;
}

export class UpdateBankDto {
    @IsString()
    @IsNotEmpty()
    bank_id: string;

    @IsString()
    @IsNotEmpty()
    bank_name: string;

    @IsString()
    @IsNotEmpty()
    account_num: string;

    @IsString()
    @IsNotEmpty()
    owner: string;
}