import { Controller, Get, Inject, Logger, LoggerService } from '@nestjs/common';
import { CheckService } from './check.service';

@Controller('health-check')
export class CheckController {
    constructor(
        private checkService: CheckService,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {}

    @Get()
    async check() {
        return 'PONG';
    }
}
