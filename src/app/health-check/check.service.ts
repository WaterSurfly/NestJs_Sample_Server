import { Injectable } from '@nestjs/common';
import {
    HealthCheckService,
    HealthCheck,
    HttpHealthIndicator,
    TypeOrmHealthIndicator,
    HealthCheckResult,
} from '@nestjs/terminus';

@Injectable()
export class CheckService {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private db: TypeOrmHealthIndicator,
    ) {}

    @HealthCheck()
    async runHealthCheck(): Promise<HealthCheckResult> {
        return this.health.check([
            () =>
                this.http.pingCheck(
                    'localhost',
                    'http://127.0.0.1:3000/health-check',
                ),
            () => this.db.pingCheck('database'),
        ]);
    }
}
