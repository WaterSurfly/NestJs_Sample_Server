import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAccountDto {
    @Transform((params) => params.value.trim())
    @IsString()
    readonly LoginId: string;

    @IsString()
    readonly CreatedTime: string;

    @IsString()
    readonly LastLoginTime: string;
}
