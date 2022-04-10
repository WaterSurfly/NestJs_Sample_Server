import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { CheckService } from '../../app/health-check/check.service';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { dbAuthConnectionName } from 'src/database';
import { TimeHelper } from 'src/utils';

@Injectable()
export class TaskService {
    constructor(
        private schedulerRegistry: SchedulerRegistry,
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private checkService: CheckService,
        @Inject(Logger) private readonly logger: LoggerService,
        @InjectRedis(dbAuthConnectionName) private readonly redis: Redis,
    ) {
        this.addCronJob();
    }

    addCronJob() {
        const name = 'ServerHealthChecker';

        const job = new CronJob('* * * * * *', () => {
            this.logger.warn(`run! ${name}`);
        });

        this.schedulerRegistry.addCronJob(name, job);

        this.logger.warn(`job ${name} added!`);
    }

    /*
    @Cron('* * * * * *', { name: 'cronTask' })
    handlerCron() {
        this.logger.log('Task Called');
    }

    @Timeout('timeoutTask', 5000)
    handleTimeout() {
        this.logger.log('Task Called by Timeout');
    }
    */

    @Interval('HealthCheck', 5000)
    async handleInterval() {
        const healthCheckRS = await this.checkService.runHealthCheck();
        this.logger.log(JSON.stringify(healthCheckRS));

        /*
        const healthCheckP = this.health.check([
            () =>
                this.http.pingCheck(
                    'localhost',
                    'http://127.0.0.1:3000/health-check',
                ),
        ]);

        healthCheckP.then((r) => {
            this.logger.log(JSON.stringify(r));
        });

        this.logger.log('Task Called by Timeout');
         */
    }

    @Interval('ExpireAccount', 3000)
    async execExpireAccount() {
        
        const redisKey = `expireAccount`;
        const now = TimeHelper.getUtcDate();
        const addTime = TimeHelper.addTime(now, -30, 'second');
        const timeStamp = addTime.valueOf();
        const expireKeys = await this.redis.zrangebyscore(redisKey, '-inf', timeStamp);
        
        this.logger.log(`execExpireAccount : ${JSON.stringify(expireKeys)}`);

        for (const expireKey of expireKeys) {
            await this.redis.del(expireKey);
        }

        if(expireKeys.length > 0) {
            await this.redis.zremrangebyscore(redisKey, '-inf', timeStamp);
        }
    }
}
