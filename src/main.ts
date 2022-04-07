import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { RedisIoAdapter } from './app/chat/redis.adapter';

dayjs.extend(utc);

const localTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
const utcTime = dayjs().utc().format('YYYY-MM-DD HH:mm:ss');

const timestampOption = {
    format: () => `${utcTime} / ${localTime}`,
};

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
                        winston.format.timestamp(timestampOption),
                        nestWinstonModuleUtilities.format.nestLike('Sample', {
                            prettyPrint: true,
                        }),
                    ),
                }),
                new (require('winston-daily-rotate-file'))({
                    format: winston.format.combine(
                        winston.format.timestamp(timestampOption),
                        winston.format.printf(
                            (log) =>
                                `[${log.timestamp}] ${log.level}: ${log.message}`,
                        ),
                    ),
                    filename: 'logs/%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    json: true,
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
    app.useStaticAssets(join(__dirname, '..', 'static'));
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.enableCors();
    await app.listen(process.env.NODE_PORT);
}

bootstrap();
