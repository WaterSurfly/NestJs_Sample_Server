import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validationSchema';
import authConfig from './config/auth-config';
import { ExceptionModule } from './common/exception/exception.module';
import { LoggingModule } from './common/interceptor/logging.module';
import { BatchModule } from './common/batch/batch.module';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import dbConfig from './config/db-config';
import { AccountModule } from './app/account/account.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ChatModule } from './app/chat/chat.module';
import { DatabaseCoreModule } from './database/database-core.module';

const loadConfigs = [authConfig, dbConfig];

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
            autoSchemaFile: join(
                process.cwd(),
                'src/common/graphql/schema.graphql',
            ), // true : 파일을 별로 만드는 것 같지는 않은데 playGround에 반영됨, 파일경로: 파일 생성됨
            debug: true,

            //typePaths: ['./**/*.graphql'], // schema first case : 수동으로 만든 write.graphql 사용해서 처리
            //definitions: {
            //    path: join(process.cwd(), 'src/graphql.ts'),
            //},

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
