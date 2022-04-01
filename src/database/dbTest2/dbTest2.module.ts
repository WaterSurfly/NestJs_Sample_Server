import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User2Repository } from './repository/user2.repository';
import { dbTest2ConnectionName } from '../database.constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([User2Repository], dbTest2ConnectionName),
    ],
    providers: [User2Repository],
    exports: [TypeOrmModule, User2Repository],
})
export class DbTest2Module {}
