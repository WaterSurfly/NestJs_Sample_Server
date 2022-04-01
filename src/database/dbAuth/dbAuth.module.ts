import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRepository } from '../dbAuth/repository/account.repository';
import { dbAuthConnectionName } from '../database.constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([AccountRepository], dbAuthConnectionName),
    ],
    providers: [AccountRepository],
    exports: [TypeOrmModule, AccountRepository],
})
export class DbAuthModule {}
