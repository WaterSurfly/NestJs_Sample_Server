import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './app/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { UsersController } from './app/users/users.controller';
import { Logger2Middleware } from './common/logger/logger2.middleware';
import authConfig from './config/authConfig';
import { ExceptionModule } from './common/exception/exception.module';
import { LoggingModule } from './common/interceptor/logging.module';
import { BatchModule } from './common/batch/batch.module';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { Users2Module } from './app/users2/users2.module';
import globalConfig from './config/globalConfig';
import { AccountModule } from './app/account/account.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ChatModule } from './app/chat/chat.module';

const loadConfigs = [emailConfig, authConfig, globalConfig];

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                `${__dirname}/config/env/.${process.env.NODE_ENV}.env`,
            ],
            load: [...loadConfigs],
            isGlobal: true,
            validationSchema,
        }),
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
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            typePaths: ['./**/*.graphql'],
            definitions: {
                path: join(process.cwd(), 'src/graphql.ts'),
            },
            playground: true,
        }),
        ExceptionModule,
        LoggingModule,
        BatchModule,
        TerminusModule,
        HttpModule,
        ChatModule,
        UsersModule,
        Users2Module,
        AccountModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
/*
export class AppModule implements NestModule {

    configure(consumer: MiddlewareConsumer): any {
        consumer
            .apply(LoggerMiddleware, Logger2Middleware)
            .forRoutes();
    }
}
*/
