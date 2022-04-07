import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class BaseResultType {
    @Field(() => String)
    resultType: ResultType;
}

export enum ResultType {
    None = 'None',
    Success = 'Success',
    Fail = 'Fail',
}
