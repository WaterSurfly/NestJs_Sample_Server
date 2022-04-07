import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { AccountInputDto } from './input/account-input.dto';
import {
    AuthOutput,
    GetAccountInfoOutput,
    GetAllAccountInfosOutput,
} from './output/account-output.dto';
import { AuthGuard } from '../../auth.guard';

@Resolver('account')
export class AccountResolver {
    constructor(private accountService: AccountService) {}

    @Query(() => String)
    async hello() {
        return this.accountService.hello();
    }

    @Query(() => String)
    async hello2() {
        return this.accountService.hello2();
    }

    // First
    @Query(() => AuthOutput)
    async auth(@Args('id', { type: () => String }) id: string) {
        return this.accountService.auth(id);
    }

    // Second (Add token in request.headers.authorization)
    // ex) { "Authorization":"Bearer :tokenString "}
    @UseGuards(AuthGuard) // jwt verify
    @Query(() => GetAccountInfoOutput)
    async login(@Args('accountId', { type: () => Number }) accountId: number) {
        return this.accountService.login(accountId);
    }

    @Query(() => GetAccountInfoOutput)
    async getAccountInfo(
        @Args('accountId', { type: () => Number }) accountId: number,
    ) {
        return this.accountService.getAccountInfo(accountId);
    }

    @Query(() => GetAllAccountInfosOutput)
    async getAllAccountInfo() {
        return this.accountService.getAllAccountInfo();
    }

    @Mutation(() => GetAccountInfoOutput)
    async createAccount(
        @Args('createAccountInput') createAccountInput: AccountInputDto,
    ) {
        return await this.accountService.createAccount(createAccountInput);
    }
}
