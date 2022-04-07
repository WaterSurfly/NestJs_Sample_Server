import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { CheckService } from '../../app/health-check/check.service';

@Injectable()
export class TaskService {
    constructor(
        private schedulerRegistry: SchedulerRegistry,
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private checkService: CheckService,
        @Inject(Logger) private readonly logger: LoggerService,
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

    @Interval('intervalTask', 5000)
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
}
