import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { AccountEntity } from '../../database/dbAuth/entity/account.entity';
import { CreateAccountInput } from './input/create-account-input';

@Resolver('account')
export class AccountResolver {
    constructor(
        private accountService: AccountService,
    ) {}

    @Query(() => String)
    async hello() {
        return this.accountService.hello();
    }

    @Query(() => String)
    async hello2() {
        return this.accountService.hello2();
    }

    @Query(() => AccountEntity)
    async login(@Args('loginId', { type: () => String }) loginId: string) {
        return this.accountService.login(loginId);
    }

    @Query(() => AccountEntity)
    async getAccountInfo(
        @Args('loginId', { type: () => String }) loginId: string,
    ) {
        return this.accountService.getAccountInfo(loginId);
    }


    @Mutation(() => AccountEntity)
    async createAccount(@Args('createAccountInput') createAccountInput: CreateAccountInput) {
        return await this.accountService.createAccount(createAccountInput);
    }
}
