import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { dbGameConnectionName } from '../../database/database.constants';
import { TimeHelper } from '../../utils/time-helper';
import { AuthService } from '../../common/auth/auth.service';
import { PlayerRepository } from '../../database/dbGame/repository/player.repository';
import { PlayerEntity } from '../../database/dbGame/entity/player.entity';
import { GetAccountInfoOutput } from '../account/output/account-output';
import { ResultType } from '../../common/base/base-result.type';
import { GetPlayerInfoOutput } from './output/player-output';

@Injectable()
export class PlayerService {
    private playerRepository: PlayerRepository;

    constructor(
        private authService: AuthService,
        @InjectConnection(dbGameConnectionName)
        private gameConn: Connection,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {
        this.playerRepository =
            this.gameConn.getCustomRepository(PlayerRepository);
    }

    async checkPlayerExist(accountId: number) {
        const player = await this.playerRepository.findOne({ accountId });
        return !!player;
    }

    async createPlayer(accountId: number) {
        const isExist = await this.checkPlayerExist(accountId);
        if (!isExist) {
            await this.savePlayerUsingQueryRunner(accountId);
        }
    }

    async savePlayerUsingQueryRunner(accountId: number): Promise<boolean> {
        const queryRunner = this.gameConn.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const now = TimeHelper.getUtcDate();
            const player = new PlayerEntity();
            player.accountId = accountId;
            player.nick = `U-${accountId}`;
            player.createdTime = now;

            await queryRunner.manager.save(player);

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

    async getPlayerInfo(accountId: number) {
        const player = await this.playerRepository.findOne({ accountId });

        const rs = new GetPlayerInfoOutput();
        rs.resultType = ResultType.Success;
        rs.info = player;
        return rs;
    }
}
