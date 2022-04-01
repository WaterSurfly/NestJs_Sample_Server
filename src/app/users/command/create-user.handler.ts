import * as uuid from 'uuid';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    LoggerService,
    UnprocessableEntityException,
} from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../database/dbTest/entity/user.entity';
import { ulid } from 'ulid';
import { UserCreatedEvent } from '../event/user-created.event';
import { TestEvent } from '../event/test.event';
import { UserRepository } from '../../../database/dbTest/repository/user.repository';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    private usersRepository: UserRepository;

    constructor(
        private connection: Connection,
        private eventBus: EventBus,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {
        this.usersRepository =
            this.connection.getCustomRepository(UserRepository);
    }

    async execute(command: CreateUserCommand) {
        const { name, email, password } = command;
        const userExist = await this.checkUserExists(email);
        if (userExist) {
            throw new UnprocessableEntityException(
                '해당 이메일로는 가입할 수 없습니다.',
            );
        }

        const signupVerifyToken = uuid.v1();

        // QueryRunner가 좀 더 명확하고 예외에 대한 핸들링 가능
        await this.saveUserUsingQueryRunner(
            name,
            email,
            password,
            signupVerifyToken,
        );
        /*
        await this.saveUserUsingTransaction(
            name,
            email,
            password,
            signupVerifyToken,
        );
         */

        this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
        this.eventBus.publish(new TestEvent());
    }

    private async checkUserExists(emailAddress: string): Promise<boolean> {
        const user = await this.usersRepository.findOne({
            email: emailAddress,
        });
        return !!user;
    }

    private async saveUserUsingQueryRunner(
        name: string,
        email: string,
        password: string,
        signupVerifyToken: string,
    ) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = new UserEntity();
            user.id = ulid();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = signupVerifyToken;

            await queryRunner.manager.save(user);

            throw new InternalServerErrorException('Forced Error!!!!!!'); // 일부러 에러를 발생시켜 본다

            await queryRunner.commitTransaction();
        } catch (e) {
            this.logger.error(e);
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async saveUserUsingTransaction(
        name: string,
        email: string,
        password: string,
        signupVerifyToken: string,
    ) {
        await this.connection.transaction(async (manager) => {
            const user = new UserEntity();
            user.id = ulid();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = signupVerifyToken;

            await manager.save(user);
        });
    }
}
