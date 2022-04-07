import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class PlayerInputDto {
    @Field()
    accountId: number;
}
