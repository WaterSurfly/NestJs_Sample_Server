import { Logger, Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { Users2Controller } from './users2.controller';
import { Users2Service } from './users2.service';
import { AuthModule } from '../../common/auth/auth.module';
import { DbTest2Module } from '../../database/dbTest2/dbTest2.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        EmailModule,
        AuthModule,
        DbTest2Module,
        ClientsModule.register([
            {
                name: 'GREETING_SERVICE',
                transport: Transport.REDIS,
                options: {
                    url: 'redis://127.0.0.1:6379',
                },
            },
        ]),
    ],
    controllers: [Users2Controller],
    providers: [Users2Service, Logger],
})
export class Users2Module {}
