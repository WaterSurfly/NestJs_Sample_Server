import {Inject, Injectable, Logger, LoggerService} from '@nestjs/common';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import {AccountRepository} from '../../database/dbAuth/repository/account.repository';
import {AccountEntity} from 'src/database/dbAuth/entity/account.entity';
import {AccountInputDto} from './input/account-input.dto';
import {TimeHelper} from '../../utils';
import {
    AuthOutput,
    GetAccountInfoOutput,
    GetAllAccountInfosOutput,
} from './output/account-output.dto';
import {ResultType} from '../../common/base/base-result.type';
import {AuthService} from '../../common/auth/auth.service';
import {PlayerService} from '../player/player.service';
import {InjectRedis, Redis} from '@nestjs-modules/ioredis';
import * as dbHelper from '../../database';
import * as redisHelper from '../../common/redis';

@Injectable()
export class AccountService {
    private readonly accountRepository: AccountRepository;

    constructor(
        @InjectConnection(dbHelper.dbAuthConnectionName)
        private readonly authConn: Connection,
        private readonly authService: AuthService,
        private readonly playerService: PlayerService,
        @Inject(Logger)
        private readonly logger: LoggerService,
        @InjectRedis(dbHelper.dbAuthConnectionName)
        private readonly redis: Redis,
    ) {
        this.accountRepository =
            this.authConn.getCustomRepository(AccountRepository);
    }

    async hello(): Promise<string> {
        const setRs = await this.redis.set('aa', '12345');
        this.logger.warn(`setRs: ${setRs}`);

        const getRs = await this.redis.get('aa');
        this.logger.warn(`getRs: ${getRs}`);

        const hsetRs = await this.redis.hset('bb', {a: 11231});
        this.logger.warn(`hsetRs: ${hsetRs}`);

        const hgetallRs = await this.redis.hgetall('bb');
        this.logger.warn(`hgetallRs: ${JSON.stringify(hgetallRs)}`);

        return 'GET Account!!! Hello';
    }

    hello2(): string {
        return 'GET Account!!! Hello2';
    }

    async auth(id: string): Promise<AuthOutput> {
        const output = new AuthOutput();

        let account = await this.getAccountByLoginId(id);
        if (!account) {
            // ?????? ??????
            const accountInput = new AccountInputDto();
            accountInput.loginId = id;
            const createRs = await this.createAccount(accountInput);
            if (!createRs) {
                output.resultType = ResultType.Fail;
                return output;
            }
            this.logger.log(`#AccountService #Msg=Create Account!!!`);
            account = await this.getAccountByLoginId(id);
        }

        const reqTime = TimeHelper.getUtcTime();
        const accountId = account.accountId;
        output.resultType = ResultType.Success;
        output.info = account;
        output.token = this.authService.generateToken({
            id,
            accountId,
            reqTime,
        });

        return output;
    }

    async getAccountByLoginId(
        loginId: string,
    ): Promise<AccountEntity | undefined> {
        return await this.getAccountInfoFromDb({loginId});
    }

    async getAccountByAccountId(
        accountId: number,
    ): Promise<AccountEntity | undefined> {
        const cacheKey = this.getAccountCacheKey(accountId);
        return await this.getAccountInfoFromCache(cacheKey, {accountId});
    }

    async getAccountInfoFromDb(condition: object) {
        return await this.accountRepository.findOne(condition);
    }

    getAccountCacheKey(accountId: number) {
        return `${redisHelper.accountPrefix}:${accountId}`;
    }

    async getAccountInfoFromCache(cacheKey: string, condition: object) {
        let data;
        const cached = await this.redis.hgetall(cacheKey);
        if (!cached || Object.keys(cached).length == 0) {
            const dataFromDb = await this.getAccountInfoFromDb(condition);
            if (dataFromDb) {
                await this.redis.hmset(cacheKey, dataFromDb);
                data = dataFromDb;
            }
        } else {
            data = cached;
        }

        await this.updateOnlineTouch(data.accountId, cacheKey);
        return data;
    }

    async login(accountId: number): Promise<GetAccountInfoOutput> {
        const output = new GetAccountInfoOutput();
        const account = await this.getAccountByAccountId(accountId);
        if (!account) {
            output.resultType = ResultType.Fail;
            return output;
        }

        await this.updateLastLoginTime(account);
        await this.playerService.createPlayer(accountId);

        output.resultType = ResultType.Success;
        output.info = await this.getAccountByAccountId(accountId);
        return output;
    }

    async createAccount(account: AccountInputDto): Promise<boolean> {
        const accounts = [];
        const now = TimeHelper.getUtcDate();
        const accountEntity = this.accountRepository.create();
        accountEntity.loginId = account.loginId;
        accountEntity.createdTime = now;
        accountEntity.lastLoginTime = now;
        accounts.push(accountEntity);

        // ???????????? case 1.
        return await dbHelper.ExecDbTransactionUsingQueryRunner(
            this.authConn,
            accounts,
            this.logger,
        );

        // ???????????? case 2.
        //return await dbHelper.ExecDbTransaction(
        //    this.accountRepository,
        //    accounts,
        //);
    }

    private async updateLastLoginTime(account: AccountEntity) {
        const where = {
            accountId: account.accountId,
        };

        const updateObj = Object.assign({}, account);
        const now = TimeHelper.getUtcDate();
        const nowStr = TimeHelper.getUtcTimeTransformFrom(now);

        updateObj.lastLoginTime = now;
        const updateRs = await this.accountRepository.update(where, updateObj);
        if (updateRs) {
            const cacheKey = this.getAccountCacheKey(account.accountId);
            this.redis.hset(cacheKey, {lastLoginTime: nowStr});
            await this.updateOnlineTouch(account.accountId, cacheKey);
        }
    }

    async updateOnlineTouch(accountId: number, value: string): Promise<void> {
        const now = TimeHelper.getUtcDate();
        const key = redisHelper.onlineKey;
        this.redis.zadd(key, now.valueOf(), value);
    }

    async getAllAccountInfo() {
        const output = new GetAllAccountInfosOutput();
        const accounts = await this.accountRepository.find();

        output.resultType = ResultType.Success;
        output.infos = accounts;

        return output;
    }
}
