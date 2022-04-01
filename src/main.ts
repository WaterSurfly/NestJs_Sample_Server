import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import {
    utilities as nestWinstonModuleUtilities,
    WinstonModule,
} from 'nest-winston';
import { AppModule } from './app.module';
import { GlobalLoggerMiddleware } from './common/logger/global-logger.middleware';
import compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { RedisIoAdapter } from './app/chat/redis.adapter';
import helmet, {contentSecurityPolicy} from 'helmet';
import csurf from 'csurf';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc);

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: WinstonModule.createLogger({
            transports: [
                new winston.transports.Console({
                    level:
                        process.env.NODE_ENV === 'production'
                            ? 'info'
                            : 'silly',
                    format: winston.format.combine(
                        winston.format.timestamp({
                            format: () =>
                                `${dayjs().format('YYYY-MM-DD HH:mm:ss')} / ${dayjs().utc().format('(UTC) YYYY-MM-DD HH:mm:ss')}`
                        }),
                        nestWinstonModuleUtilities.format.nestLike('Sample', {
                            prettyPrint: true,
                        }),
                    ),
                }),
            ],
        }),
        cors: true,
    });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
    app.use(GlobalLoggerMiddleware);
    app.use(compression());
    //app.use(helmet());
    //app.use(csurf());
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.useStaticAssets(join(__dirname, '..', 'static'));
    app.enableCors();
    // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    await app.listen(process.env.NODE_PORT);
}
bootstrap();
