import {
    Entity,
    PrimaryColumn,
    Column,
    BaseEntity,
    Index,
} from 'typeorm';
import { DateTimeTransformer } from "../../../utils/time-helper";

@Entity('Player')
export class PlayerEntity extends BaseEntity{
    @PrimaryColumn()
    accountId: number;

    @Column()
    nick: string;

    @Column({ type: 'datetime', transformer: new DateTimeTransformer() })
    createdTime: Date;
}

