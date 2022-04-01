import {
    Controller,
    Get,
    Post,
    Body,
    Inject,
    CACHE_MANAGER,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountLoginDto } from '../account/dto/account-login.dto';
import { Cache } from 'cache-manager';

@Controller('account')
export class AccountController {
    constructor(
        private accountService: AccountService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Get()
    getHello(): string {
        return this.accountService.hello();
    }

    @Get('/cache')
    async getCache(): Promise<string> {
        const savedTime = await this.cacheManager.get<number>('time');
        if (savedTime) {
            return `saved time : ${savedTime}`;
        }

        const now = new Date().getDate();
        await this.cacheManager.set<number>('time', now, { ttl: 1000 });
        return `saved time : ${now}`;
    }

    @Post('/login')
    async login(@Body() dto: AccountLoginDto): Promise<object> {
        const { LoginId } = dto;
        return await this.accountService.login(LoginId);
    }
}
