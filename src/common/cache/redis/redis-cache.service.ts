import {Injectable} from '@nestjs/common';
import {InjectRedis, Redis} from '@nestjs-modules/ioredis';

@Injectable()
export class RedisCacheService {
    constructor(@InjectRedis() private readonly redis: Redis) {
    }

    async get(key: string): Promise<any> {
        return this.redis.get(key);
    }

    async set(key: string, value: any): Promise<any> {
        // return "OK"
        return this.redis.set(key, value);
    }

    async hset(key: string, field: string, value: any): Promise<number> {
        // return 0 or 1
        return this.redis.hset(key, field, value);
    }

    async hgetall(key: string): Promise<object> {
        return this.redis.hgetall(key);
    }


}
