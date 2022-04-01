import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { AccountInput } from './input/account-input';
import { GetAccountInfoOutput, GetAllAccountInfosOutput } from "./output/account-output";

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

    @Query( () => GetAccountInfoOutput)
    async login(@Args('loginId', { type: () => String }) loginId: string) {
        return this.accountService.login(loginId);
    }

    @Query(() => GetAccountInfoOutput)
    async getAccountInfo(
        @Args('loginId', { type: () => String }) loginId: string,
    ) {
        return this.accountService.getAccountInfo(loginId);
    }

    @Query(() => GetAllAccountInfosOutput)
    async getAllAccountInfo() {
        return this.accountService.getAllAccountInfo();
    }

    @Mutation( () => GetAccountInfoOutput)
    async createAccount(@Args('createAccountInput') createAccountInput: AccountInput) {
        return await this.accountService.createAccount(createAccountInput);
    }
}
