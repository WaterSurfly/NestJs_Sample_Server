import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/app/email/email.module';
import { UserEntity } from '../../database/dbTest/entity/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/common/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UserEventsHandler } from './event/user-events.handler';
import { GetUserInfoHandler } from './query/get-user-info.handler';
import { CreateUserHandler } from './command/create-user.handler';
import { DbTestModule } from '../../database/dbTest/dbTest.module';

const commandHandlers = [CreateUserHandler];
const queryHandlers = [GetUserInfoHandler];
const eventHandlers = [UserEventsHandler];

@Module({
    imports: [EmailModule, AuthModule, DbTestModule, CqrsModule],
    controllers: [UsersController],
    providers: [Logger, ...commandHandlers, ...eventHandlers, ...queryHandlers],
})
export class UsersModule {}
