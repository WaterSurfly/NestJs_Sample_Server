import {
    Entity,
    PrimaryColumn,
    Column,
    BaseEntity,
} from 'typeorm';
import { DateTimeTransformer } from "../../../utils/time-helper";

@Entity('Account')
export class AccountEntity extends BaseEntity{
    @PrimaryColumn()
    accountId: Number;

    @Column()
    loginId: string;

    @Column({ type: 'datetime', transformer: new DateTimeTransformer() })
    createdTime: Date;

    @Column({ type: 'datetime', transformer: new DateTimeTransformer() })
    lastLoginTime: Date;
}

