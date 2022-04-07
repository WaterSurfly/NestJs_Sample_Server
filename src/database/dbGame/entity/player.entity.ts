import {
    Entity,
    PrimaryColumn,
    Column,
    BaseEntity,
    Index,
} from 'typeorm';
import { DateTimeTransformer } from "../../../utils/time-helper";
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity('Player')
export class PlayerEntity extends BaseEntity{
    @Field(() => Number)
    @PrimaryColumn()
    accountId: number;

    @Field(() => String)
    @Column()
    nick: string;

    @Field(() => String)
    @Column({ type: 'datetime', transformer: new DateTimeTransformer() })
    createdTime: Date;
}

