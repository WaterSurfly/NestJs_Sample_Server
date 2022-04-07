import {Transform} from "class-transformer";
import {IsNumber, IsString} from "class-validator";
import {BaseResultType} from "../../../common/base/base-result.type"

// BaseInfoDto
export class PlayerInfoDto {
    @Transform((params) => params.value.trim())
    @IsNumber()
    accountId: number;

    @IsString()
    nick: string;

    @IsString()
    createdTime: Date;
}

// Response Output : get player info
export class GetPlayerInfoOutput extends BaseResultType {
    info: PlayerInfoDto
}
