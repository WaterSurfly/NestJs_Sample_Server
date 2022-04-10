import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRepository } from '../dbAuth/repository/account.repository';
import { dbAuthConnectionName } from '../database.constants';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
    imports: [
        TypeOrmModule.forFeature([AccountRepository], dbAuthConnectionName),
        RedisModule.forRoot({
            config: {
                url: 'redis://localhost:6379',
            },
        }, dbAuthConnectionName),
    ],
    providers: [AccountRepository],
    exports: [TypeOrmModule, AccountRepository],
})
export class DbAuthModule {}
