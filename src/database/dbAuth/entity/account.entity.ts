import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index } from 'typeorm';
import { DateTimeTransformer } from '../../../utils/time-helper';

@ObjectType()
@Entity('Account')
export class AccountEntity extends BaseEntity {
    @Field(() => Number)
    @PrimaryGeneratedColumn()
    accountId: number;

    @Field(() => String)
    @Index({unique: true})
    @Column()
    loginId: string;

    @Field(() => String)
    @Column({type: 'datetime', transformer: new DateTimeTransformer()})
    createdTime: Date;

    @Field(() => String)
    @Column({type: 'datetime', transformer: new DateTimeTransformer()})
    lastLoginTime: Date;
}
