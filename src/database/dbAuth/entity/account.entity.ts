import { Field, ObjectType } from '@nestjs/graphql';
import {
    Entity,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
} from 'typeorm';

@ObjectType()
@Entity('Account')
export class AccountEntity {
    @Field(() => String)
    @PrimaryColumn()
    loginId: string;

    @Field(() => Date)
    @Column()
    createdTime: string;

    @Field(() => Date)
    @Column()
    lastLoginTime: string;
}
