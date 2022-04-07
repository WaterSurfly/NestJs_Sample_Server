import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseResultType } from '../../../common/base/base-result.type';

// BaseInfoDto
export class AccountInfoDto {
    @Transform((params) => params.value.trim())
    @IsString()
    loginId: string;

    @IsString()
    createdTime: Date;

    @IsString()
    lastLoginTime: Date;
}

// Response Output : get auth
export class AuthOutput extends BaseResultType {
    info: AccountInfoDto;
    token: string;
}

// Response Output : get one account
export class GetAccountInfoOutput extends BaseResultType {
    info: AccountInfoDto;
}

// Response Output : get all accounts
export class GetAllAccountInfosOutput extends BaseResultType {
    infos: AccountInfoDto[];
}
