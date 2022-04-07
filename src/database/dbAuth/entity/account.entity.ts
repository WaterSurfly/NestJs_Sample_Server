import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index} from 'typeorm';
import {DateTimeTransformer} from '../../../utils/time-helper';

@Entity('Account')
export class AccountEntity extends BaseEntity {
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
