import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PlayerInput {
    @Field()
    accountId: number;
}
