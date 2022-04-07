import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class AccountInputDto {
    @Field()
    loginId: string;
}
