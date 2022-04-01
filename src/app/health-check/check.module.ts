import { Logger, Module } from '@nestjs/common';
import { CheckController } from './check.controller';
import { CheckService } from './check.service';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TerminusModule, HttpModule],
    controllers: [CheckController],
    providers: [CheckService, Logger],
    exports: [CheckService],
})
export class CheckModule {}
