import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validationSchema';
import authConfig from './config/authConfig';
import { ExceptionModule } from './common/exception/exception.module';
import { LoggingModule } from './common/interceptor/logging.module';
import { BatchModule } from './common/batch/batch.module';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import globalConfig from './config/globalConfig';
import { AccountModule } from './app/account/account.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ChatModule } from './app/chat/chat.module';
import { DatabaseCoreModule } from './database/database-core.module';

const loadConfigs = [authConfig, globalConfig];

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
        DatabaseCoreModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            typePaths: ['./**/*.graphql'],
            definitions: {
                path: join(process.cwd(), 'src/graphql.ts'),
            },
            playground: true,
            context: ({ req, connection }) => {
                if (req) {
                    const user = req.headers.authorization;
                    return { ...req, user };
                } else {
                    return connection;
                }
            },
        }),
        ExceptionModule,
        LoggingModule,
        BatchModule,
        TerminusModule,
        HttpModule,
        ChatModule,
        AccountModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
