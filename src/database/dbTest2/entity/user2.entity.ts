import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('User2', { database: 'dbTest2' })
export class User2Entity {
    @PrimaryColumn()
    id: string;

    @Column({ length: 30 })
    name: string;

    @Column({ length: 60 })
    email: string;

    @Column({ length: 30 })
    password: string;

    @Column({ length: 60 })
    signupVerifyToken: string;
}
