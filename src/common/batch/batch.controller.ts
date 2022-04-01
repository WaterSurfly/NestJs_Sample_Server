import { Controller, Get, Logger, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batch')
export class BatchController {
    private readonly logger = new Logger(BatchController.name);

    constructor(private schedulerRegistry: SchedulerRegistry) {}

    @Get()
    getHello() {
        this.logger.log('getHello');
    }

    @Post('/start-sample')
    start() {
        const job = this.schedulerRegistry.getCronJob('cronSample');

        job.start();
        this.logger.log(`start!! ${job.lastDate()}`);
    }

    @Post('/stop-sample')
    stop() {
        const job = this.schedulerRegistry.getCronJob('cronSample');

        job.stop();
        this.logger.log(`stop!! ${job.lastDate()}`);
    }
}
