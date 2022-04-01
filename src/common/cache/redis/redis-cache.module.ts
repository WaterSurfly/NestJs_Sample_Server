import { Module, CacheModule } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
//import * as redisStore from 'cache-manager-ioredis';

/*
const cacheModule = CacheModule.registerAsync({
    useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }),
});
 */

@Module({
    imports: [],
    providers: [RedisCacheService],
    exports: [],
})
export class RedisCacheModule {}
