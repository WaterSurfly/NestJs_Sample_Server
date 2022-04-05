import {
    Entity,
    PrimaryColumn,
    Column,
    BaseEntity,
    Index,
} from 'typeorm';
import { DateTimeTransformer } from "../../../utils/time-helper";

@Entity('Account')
export class AccountEntity extends BaseEntity{
    @PrimaryColumn()
    accountId: Number;

    @Index({ unique: true })
    @Column()
    loginId: string;

    @Column({ type: 'datetime', transformer: new DateTimeTransformer() })
    createdTime: Date;

    @Column({ type: 'datetime', transformer: new DateTimeTransformer() })
    lastLoginTime: Date;
}

