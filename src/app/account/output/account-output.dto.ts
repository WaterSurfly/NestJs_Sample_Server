import { Transform } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';
import { BaseResultType } from '../../../common/base/base-result.type';
import { ObjectType, Field } from '@nestjs/graphql';
import { Account } from 'src/common/interfaces';

// BaseInfoDto
@ObjectType()
export class AccountInfoDto implements Account {
    @Transform((params) => params.value.trim())
    @Field(() => String)
    @IsNumber()
    accountId: number;
    
    @Field(() => String)
    @IsString()
    loginId: string;

    @Field(() => String)
    @IsString()
    createdTime: Date;

    @Field(() => String)
    @IsString()
    lastLoginTime: Date;
}

// Response Output : get auth
@ObjectType()
export class AuthOutput extends BaseResultType {
    @Field(() => AccountInfoDto)
    info: AccountInfoDto;

    @Field(() => String)
    token: string;
}

// Response Output : get one account
@ObjectType()
export class GetAccountInfoOutput extends BaseResultType {
    @Field(() => AccountInfoDto)
    info: AccountInfoDto;
}

// Response Output : get all accounts
@ObjectType()
export class GetAllAccountInfosOutput extends BaseResultType {
    @Field(() => AccountInfoDto)
    infos: AccountInfoDto[];
}
