import {Transform} from "class-transformer";
import {IsNumber, IsString} from "class-validator";
import {BaseResultType} from "../../../common/base/base-result.type"
import { ObjectType, Field } from '@nestjs/graphql';

// BaseInfoDto
@ObjectType()
export class PlayerInfoDto {
    @Field(() => Number)
    @Transform((params) => params.value.trim())
    @IsNumber()
    accountId: number;

    @Field(() => String)
    @IsString()
    nick: string;

    @Field(() => String)
    @IsString()
    createdTime: Date;
}

// Response Output : get player info
@ObjectType()
export class GetPlayerInfoOutput extends BaseResultType {
    @Field(() => PlayerInfoDto)
    info: PlayerInfoDto
}
