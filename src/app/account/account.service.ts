import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    LoggerService,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { dbAuthConnectionName } from '../../database/database.constants';
import { AccountRepository } from '../../database/dbAuth/repository/account.repository';
import { AccountEntity } from 'src/database/dbAuth/entity/account.entity';
import { CreateAccountInput } from './input/create-account-input';
import { TimeHelper } from '../../utils/time-helper';

@Injectable()
export class AccountService {
    private accountRepository: AccountRepository;

    constructor(
        @InjectConnection(dbAuthConnectionName)
        private connection: Connection,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {
        this.accountRepository =
            this.connection.getCustomRepository(AccountRepository);
    }

    hello(): string {
        return 'GET Account!!! Hello';
    }

    hello2(): string {
        return 'GET Account!!! Hello2';
    }

    private async checkAccountExists(loginId: string): Promise<boolean> {
        const account = await this.accountRepository.findOne({
            loginId,
        });
        return !!account;
    }

    async saveAccountUsingQueryRunner(loginId: string): Promise<boolean> {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const now = TimeHelper.getUtcTime();
            const account = new AccountEntity();
            account.loginId = loginId;
            account.createdTime = now;
            account.lastLoginTime = now;

            await queryRunner.manager.save(account);

            //throw new InternalServerErrorException(); // 일부러 에러를 발생시켜 본다

            await queryRunner.commitTransaction();

            return true;
        } catch (e) {
            this.logger.error(e);
            await queryRunner.rollbackTransaction();
            return false;
        } finally {
            await queryRunner.release();
        }
    }

    async login(loginId: string): Promise<object> {
        const isExist = await this.checkAccountExists(loginId);

        if (!isExist) {
            throw new InternalServerErrorException('로그인 실패하였습니다.');
        }

        await this.updateLastLoginTime(loginId);
        return await this.getAccountInfo(loginId);
    }

    async createAccount(account: CreateAccountInput): Promise<AccountEntity> {
        const isExist = await this.checkAccountExists(account.loginId);
        if (isExist) {
            throw new InternalServerErrorException(
                '이미 동일한 이름의 계정이 존재합니다.',
            );
        }

        // 계정생성
        const rs = await this.saveAccountUsingQueryRunner(account.loginId);
        if (!rs) {
            throw new UnprocessableEntityException(
                '계정 생성에 실패하였습니다.',
            );
        }

        return await this.getAccountInfo(account.loginId);
    }

    async getAccountInfo(loginId: string): Promise<AccountEntity> {
        const account = await this.accountRepository.findOne({
            loginId,
        });

        return account;
    }

    private async updateLastLoginTime(loginId) {
        const account = await this.accountRepository.findOne({
            loginId,
        });

        account.lastLoginTime = TimeHelper.getUtcTime();
        await this.accountRepository.save(account);
    }
}
