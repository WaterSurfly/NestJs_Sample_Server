import { Logger, Module } from '@nestjs/common';
import { DbAuthModule } from 'src/database/dbAuth/dbAuth.module';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';

@Module({
    imports: [DbAuthModule],
    controllers: [],
    providers: [AccountService, Logger, AccountResolver],
})
export class AccountModule {}
