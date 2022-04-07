import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalLoggerMiddleware } from './common/logger/global-logger.middleware';
import compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { RedisIoAdapter } from './app/chat/redis.adapter';
import { logger } from './utils';

const appOptions = {
    logger,
    cors: true,
};

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        appOptions,
    );
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
