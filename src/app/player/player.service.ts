import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { TimeHelper } from '../../utils';
import { AuthService } from '../../common/auth/auth.service';
import { PlayerRepository } from '../../database/dbGame/repository/player.repository';
import { PlayerEntity } from '../../database/dbGame/entity/player.entity';
import { ResultType } from '../../common/base/base-result.type';
import { GetPlayerInfoOutput } from './output/player-output.dto';
import {
    dbGameConnectionName,
    ExecDbTransactionUsingQueryRunner,
    ExecDbTransaction,
} from '../../database';

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
        try {
            const isExist = await this.checkPlayerExist(accountId);
            if (!isExist) {
                const players = [];
                const now = TimeHelper.getUtcDate();
                const player = new PlayerEntity();
                player.accountId = accountId;
                player.nick = `U-${accountId}`;
                player.createdTime = now;
                players.push(player);

                const rs = await ExecDbTransaction(
                    this.playerRepository,
                    players,
                );

                if (!rs) {
                    throw new Error('Player create fail DB!!!');
                }
            }
        } catch (e) {
            this.logger.error(e);
            const rs = new GetPlayerInfoOutput();
            rs.resultType = ResultType.Fail;
            return rs;
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
