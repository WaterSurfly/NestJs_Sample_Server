import { Logger, Module } from '@nestjs/common';
import { DbAuthModule } from 'src/database/dbAuth/dbAuth.module';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import {AuthModule} from "../../common/auth/auth.module";

@Module({
    imports: [DbAuthModule, AuthModule],
    controllers: [],
    providers: [AccountService, Logger, AccountResolver],
})
export class AccountModule {}
