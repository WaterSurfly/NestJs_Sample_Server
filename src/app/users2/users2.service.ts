import * as uuid from 'uuid';
import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    LoggerService,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../email/email.service';
import { UserInfo } from './UserInfo';
import { Connection, Repository } from 'typeorm';
import { User2Repository } from '../../database/dbTest2/repository/user2.repository';
import { User2Entity } from '../../database/dbTest2/entity/user2.entity';
import { ulid } from 'ulid';
import { AuthService } from '../../common/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { dbTest2ConnectionName } from '../../database/database.constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class Users2Service {
    private usersRepository: User2Repository;

    constructor(
        private emailService: EmailService,
        @InjectConnection(dbTest2ConnectionName)
        private connection: Connection,
        private authService: AuthService,
        @Inject(Logger) private readonly logger: LoggerService,
        @Inject('GREETING_SERVICE') private client: ClientProxy,
    ) {
        this.usersRepository =
            this.connection.getCustomRepository(User2Repository);
    }

    async getHello() {
        return this.client.send({ cmd: 'greeting' }, 'Progressive Coder');
    }

    async getHelloAsync() {
        const message = await this.client.send(
            { cmd: 'greeting-async' },
            'Progressive Coder',
        );
        return message;
    }

    async publishEvent() {
        this.client.emit('book-created', {
            bookName: 'The Way Of Kings',
            author: 'Brandon Sanderson',
        });
    }

    async createUser(name: string, email: string, password: string) {
        const userExist = await this.checkUserExists(email);
        if (userExist) {
            throw new UnprocessableEntityException(
                '해당 이메일로는 가입할 수 없습니다.',
            );
        }

        const signupVerifyToken = uuid.v1();

        // await this.saveUser(name, email, password, signupVerifyToken);
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
        await this.sendMemberJoinEmail(email, signupVerifyToken);
    }

    private async checkUserExists(emailAddress: string): Promise<boolean> {
        const user = await this.usersRepository.findOne({
            email: emailAddress,
        });
        return !!user;
    }

    private async saveUser(
        name: string,
        email: string,
        password: string,
        signupVerifyToken: string,
    ) {
        const user = new User2Entity();
        user.id = ulid();
        user.name = name;
        user.email = email;
        user.password = password;
        user.signupVerifyToken = signupVerifyToken;
        await this.usersRepository.save(user);
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
            const user = new User2Entity();
            user.id = ulid();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = signupVerifyToken;

            await queryRunner.manager.save(user);

            throw new InternalServerErrorException(); // 일부러 에러를 발생시켜 본다

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
            const user = new User2Entity();
            user.id = ulid();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = signupVerifyToken;

            await manager.save(user);
        });
    }

    private async sendMemberJoinEmail(
        email: string,
        signupVerifyToken: string,
    ) {
        await this.emailService.sendMemberJoinVerification(
            email,
            signupVerifyToken,
        );
    }

    async verifyEmail(signupVerifyToken: string): Promise<string> {
        const user = await this.usersRepository.findOne({
            signupVerifyToken,
        });

        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다');
        }

        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.usersRepository.findOne({
            email,
            password,
        });

        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다');
        }

        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    }

    async getUserInfo(userId: string): Promise<UserInfo> {
        const user = await this.usersRepository.findOne({ id: userId });

        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
}
