import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
    dbTest: {
        type: process.env.DATABASE_TYPE,
        replication: {
            master: {
                host: process.env.DATABASE_HOST,
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
            },
            slaves: [
                {
                    host: process.env.DATABASE_HOST,
                    port: process.env.DATABASE_PORT,
                    username: process.env.DATABASE_USERNAME,
                    password: process.env.DATABASE_PASSWORD,
                    database: process.env.DATABASE_NAME,
                },
            ],
            /**
             * Determines how slaves are selected:
             * RR: Select one alternately (Round-Robin).
             * RANDOM: Select the node by random function.
             * ORDER: Select the first node available unconditionally.
             */
            selector: process.env.DATABASE_SELECTOR,
        },
        autoLoadEntities: true,
        synchronize: false,
        entities: [
            __dirname +
                '/database/' +
                process.env.DATABASE_NAME +
                '/*.entity{.ts,.js}',
        ],
    },
    dbTest2: {
        type: process.env.DATABASE_TYPE,
        replication: {
            master: {
                host: process.env.DATABASE_HOST,
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_TEST2_NAME,
            },
            slaves: [
                {
                    host: process.env.DATABASE_HOST,
                    port: process.env.DATABASE_PORT,
                    username: process.env.DATABASE_USERNAME,
                    password: process.env.DATABASE_PASSWORD,
                    database: process.env.DATABASE_TEST2_NAME,
                },
            ],
            selector: process.env.DATABASE_SELECTOR,
        },
        autoLoadEntities: true,
        synchronize: false,
        entities: [
            __dirname +
                '/database/' +
                process.env.DATABASE_TEST2_NAME +
                '/*.entity{.ts,.js}',
        ],
    },
    dbAuth: {
        type: process.env.DATABASE_TYPE,
        replication: {
            master: {
                host: process.env.DATABASE_HOST,
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_AUTH_NAME,
            },
            slaves: [
                {
                    host: process.env.DATABASE_HOST,
                    port: process.env.DATABASE_PORT,
                    username: process.env.DATABASE_USERNAME,
                    password: process.env.DATABASE_PASSWORD,
                    database: process.env.DATABASE_AUTH_NAME,
                },
            ],
            selector: process.env.DATABASE_SELECTOR,
        },
        logging: true,
        autoLoadEntities: true,
        synchronize: false,
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
        replication: {
            master: {
                host: process.env.DATABASE_HOST,
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_COMMON_NAME,
            },
            slaves: [
                {
                    host: process.env.DATABASE_HOST,
                    port: process.env.DATABASE_PORT,
                    username: process.env.DATABASE_USERNAME,
                    password: process.env.DATABASE_PASSWORD,
                    database: process.env.DATABASE_COMMON_NAME,
                },
            ],
            selector: process.env.DATABASE_SELECTOR,
        },
        logging: true,
        autoLoadEntities: true,
        synchronize: false,
        entities: [
            __dirname +
                '/database/' +
                process.env.DATABASE_AUTH_NAME +
                '/*.entity{.ts,.js}',
        ],
    },
    dbGame: {
        type: process.env.DATABASE_TYPE,
        replication: {
            master: {
                host: process.env.DATABASE_HOST,
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_GAME_NAME,
            },
            slaves: [
                {
                    host: process.env.DATABASE_HOST,
                    port: process.env.DATABASE_PORT,
                    username: process.env.DATABASE_USERNAME,
                    password: process.env.DATABASE_PASSWORD,
                    database: process.env.DATABASE_GAME_NAME,
                },
            ],
            selector: process.env.DATABASE_SELECTOR,
        },
        logging: true,
        autoLoadEntities: true,
        synchronize: false,
        entities: [
            __dirname +
                '/database/' +
                process.env.DATABASE_AUTH_NAME +
                '/*.entity{.ts,.js}',
        ],
    },
}));
