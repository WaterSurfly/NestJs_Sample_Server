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
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/app/email/email.service';
import { UserInfo } from './UserInfo';
import { Connection, Repository } from 'typeorm';
import { UserRepository } from '../../database/dbTest/repository/user.repository';
import { UserEntity } from '../../database/dbTest/entity/user.entity';
import { ulid } from 'ulid';
import { AuthService } from '../../common/auth/auth.service';

@Injectable()
export class UsersService {
    constructor(
        private emailService: EmailService,
        private usersRepository: UserRepository,
        private connection: Connection,
        private authService: AuthService,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {}

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
        const user = new UserEntity();
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
            const user = new UserEntity();
            user.id = ulid();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = signupVerifyToken;

            await queryRunner.manager.save(user);

            throw new InternalServerErrorException(); // 일부러 에러를 발생시켜 본다

            await queryRunner.commitTransaction();
        } catch (e) {
            // 에러가 발생하면 롤백
            this.logger.error(e);
            await queryRunner.rollbackTransaction();
        } finally {
            // 직접 생성한 QueryRunner는 해제시켜 주어야 함
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
