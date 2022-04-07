import { Logger, Module } from '@nestjs/common';
import { DbAuthModule } from 'src/database/dbAuth/dbAuth.module';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { AuthModule } from '../../common/auth/auth.module';
import { PlayerModule } from '../player/player.module';
import { RedisCacheModule } from '../../common/cache/redis/redis-cache.module';

@Module({
    imports: [AuthModule, DbAuthModule, PlayerModule, RedisCacheModule],
    controllers: [],
    providers: [AccountService, Logger, AccountResolver],
})
export class AccountModule {}
