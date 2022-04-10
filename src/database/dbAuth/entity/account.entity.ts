import { Account } from 'src/common/interfaces';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { DateTimeTransformer } from '../../../utils/time-helper';

@Entity('Account')
export class AccountEntity implements Account {
    @PrimaryGeneratedColumn()
    accountId: number;

    @Index({unique: true})
    @Column()
    loginId: string;

    @Column({type: 'datetime', transformer: new DateTimeTransformer()})
    createdTime: Date;

    @Column({type: 'datetime', transformer: new DateTimeTransformer()})
    lastLoginTime: Date;
}
