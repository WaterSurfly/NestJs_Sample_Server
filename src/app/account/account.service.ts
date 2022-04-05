import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    LoggerService,
    UnprocessableEntityException,
} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import {dbAuthConnectionName} from '../../database/database.constants';
import {AccountRepository} from '../../database/dbAuth/repository/account.repository';
import {AccountEntity} from 'src/database/dbAuth/entity/account.entity';
import {AccountInput} from './input/account-input';
import {TimeHelper} from '../../utils/time-helper';
import {AuthOutput, GetAccountInfoOutput, GetAllAccountInfosOutput} from "./output/account-output";
import {ResultType} from "../../common/base/base-result.type";
import {AuthService} from "../../common/auth/auth.service";

@Injectable()
export class AccountService {
    private accountRepository: AccountRepository;

    constructor(
        @InjectConnection(dbAuthConnectionName)
        private authConn: Connection,
        private authService: AuthService,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {
        this.accountRepository =
            this.authConn.getCustomRepository(AccountRepository);
    }

    hello(): string {
        return 'GET Account!!! Hello';
    }

    hello2(): string {
        return 'GET Account!!! Hello2';
    }

    async auth(id: string): Promise<any> {
        let rs;
        const isExist = await this.checkAccountExist(id);
        if (isExist) { // 계정 존재
            rs = await this.getAccountInfo(id);

        } else {
            // 계정 생성
            const accountInput = new AccountInput();
            accountInput.loginId = id;
            rs = await this.createAccount(accountInput);

        }

        const reqTime = TimeHelper.getUtcTime();

        const authRs = new AuthOutput();
        authRs.resultType = rs.resultType;
        authRs.info = rs.info;
        const accountId = rs.info.accountId;
        authRs.token = this.authService.generateToken({id ,accountId, reqTime});

        return authRs;
    }

    async login(accountId: number): Promise<any> {
        const isExist = await this.checkAccountExist(accountId);

        if (!isExist) {
            const rs = new GetAccountInfoOutput();
            rs.resultType = ResultType.Fail;
            return rs;
        }

        await this.updateLastLoginTime(accountId);
        return await this.getAccountInfo(accountId);
    }

    async createAccount(account: AccountInput) {
        const isExist = await this.checkAccountExist(account.loginId);
        if (isExist) {
            const rs = new GetAccountInfoOutput();
            rs.resultType = ResultType.Fail;
            return rs;
        }

        // 계정생성
        const rs = await this.saveAccountUsingQueryRunner(account.loginId);
        if (!rs) {
            const rs = new GetAccountInfoOutput();
            rs.resultType = ResultType.Fail;
            return rs;
        }

        return await this.getAccountInfo(account.loginId);
    }

    async checkAccountExist(value: any) {
        let condition;
        const type = typeof value;
        if(type === 'number') {
            condition = { accountId: value };
        } else {
            condition = { loginId: value }
        }
        const account = await this.accountRepository.findOne(condition);
        return !!account;
    }

    async saveAccountUsingQueryRunner(loginId: string): Promise<boolean> {
        const queryRunner = this.authConn.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const now = TimeHelper.getUtcDate();
            const account = new AccountEntity();
            account.loginId = loginId;
            account.createdTime = now;
            account.lastLoginTime = now;

            await queryRunner.manager.save(account);

            //throw new InternalServerErrorException(); // forced error

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

    async getAccountInfo(value: any) {
        let condition;
        const type = typeof value;
        if(type === 'number') {
            condition = { accountId: value };
        } else {
            condition = { loginId: value }
        }
        const account = await this.accountRepository.findOne(condition);

        const rs = new GetAccountInfoOutput();
        rs.resultType = ResultType.Success;
        rs.info = account;

        return rs;
    }

    private async updateLastLoginTime(accountId) {
        const account = await this.accountRepository.findOne({
            accountId,
        });

        account.lastLoginTime = TimeHelper.getUtcDate();
        await this.accountRepository.save(account);
    }

    async getAllAccountInfo() {
        const accounts = await this.accountRepository.find();

        const rs = new GetAllAccountInfosOutput()
        rs.resultType = ResultType.Success;
        rs.infos = accounts;

        return rs;
    }

    async getPlayerInfo() {

    }

    async createPlayer() {

    }
}
