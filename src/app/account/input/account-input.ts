import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AccountInput {
    @Field()
    loginId: string;
}
