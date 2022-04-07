import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) =>
                config.get('global.db.dbTest'),
            inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
            name: 'dbTest2',
            useFactory: (configs: ConfigService) =>
                configs.get('global.db.dbTest2'),
            inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
            name: 'dbAuth',
            useFactory: (configs: ConfigService) =>
                configs.get('global.db.dbAuth'),
            inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
            name: 'dbCommon',
            useFactory: (configs: ConfigService) =>
                configs.get('global.db.dbCommon'),
            inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
            name: 'dbGame',
            useFactory: (configs: ConfigService) =>
                configs.get('global.db.dbGame'),
            inject: [ConfigService],
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseCoreModule {}