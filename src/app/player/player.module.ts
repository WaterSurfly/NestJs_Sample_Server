import { Logger, Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { AuthModule } from '../../common/auth/auth.module';
import { DbGameModule } from '../../database/dbGame/dbGame.module';
import { PlayerResolver } from './player.resolver';

@Module({
    imports: [AuthModule, DbGameModule],
    controllers: [],
    providers: [PlayerService, Logger, PlayerResolver],
    exports: [PlayerService],
})
export class PlayerModule {}
