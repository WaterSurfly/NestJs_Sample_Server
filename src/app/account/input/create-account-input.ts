import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAccountInput {
    @Field()
    loginId: string;
}
