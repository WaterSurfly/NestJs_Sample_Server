import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import redisIoAdapter from 'socket.io-redis';

export class RedisIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: ServerOptions): any {
        const server = super.createIOServer(port, { allowEIO3: true });

        // @ts-ignore
        const redisAdapter = redisIoAdapter({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        });

        server.adapter(redisAdapter);
        return server;
    }
}
