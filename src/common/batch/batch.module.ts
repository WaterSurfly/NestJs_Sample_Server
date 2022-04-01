import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { BatchController } from './batch.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { CheckModule } from '../../app/health-check/check.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TerminusModule,
        HttpModule,
        CheckModule,
    ],
    controllers: [BatchController],
    providers: [TaskService],
})
export class BatchModule {}
