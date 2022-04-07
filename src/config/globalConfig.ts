import {registerAs} from '@nestjs/config';

export default registerAs('global', () => ({
    db: {
        dbTest: {
            type: process.env.DATABASE_TYPE,
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            autoLoadEntities: true,
            synchronize: false,
            database: process.env.DATABASE_NAME,
            entities: [
                __dirname +
                '/database/' +
                process.env.DATABASE_NAME +
                '/*.entity{.ts,.js}',
            ],
        },
        dbTest2: {
            type: process.env.DATABASE_TYPE,
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            autoLoadEntities: true,
            synchronize: false,
            database: process.env.DATABASE_TEST2_NAME,
            entities: [
                __dirname +
                '/database/' +
                process.env.DATABASE_TEST2_NAME +
                '/*.entity{.ts,.js}',
            ],
        },
        dbAuth: {
            type: process.env.DATABASE_TYPE,
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            autoLoadEntities: true,
            synchronize: false,
            database: process.env.DATABASE_AUTH_NAME,
            entities: [
                __dirname +
                '/database/' +
                process.env.DATABASE_AUTH_NAME +
                '/*.entity{.ts,.js}',
            ],
            migrations: [
                __dirname +
                '/database/' +
                process.env.DATABASE_AUTH_NAME +
                '/*{.ts,.js}',
            ],
            migrationsTableName: 'migrations_typeorm',
            migrationsRun: true,
            cli: {
                migrationsDir:
                    'src/database/' +
                    process.env.DATABASE_AUTH_NAME +
                    '/migrations',
            },
        },
        dbCommon: {
            type: process.env.DATABASE_TYPE,
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            autoLoadEntities: true,
            synchronize: false,
            database: process.env.DATABASE_COMMON_NAME,
            entities: [
                __dirname +
                '/database/' +
                process.env.DATABASE_AUTH_NAME +
                '/*.entity{.ts,.js}',
            ],
        },
        dbGame: {
            type: process.env.DATABASE_TYPE,
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            autoLoadEntities: true,
            synchronize: false,
            database: process.env.DATABASE_GAME_NAME,
            entities: [
                __dirname +
                '/database/' +
                process.env.DATABASE_AUTH_NAME +
                '/*.entity{.ts,.js}',
            ],
        },
    },
}));
