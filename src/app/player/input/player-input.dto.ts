import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class PlayerInputDto {
    @Field(() => Number)
    accountId: number;
}
