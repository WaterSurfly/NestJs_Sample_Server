
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateAccountInput {
    loginId: string;
}

export interface AccountEntity {
    loginId: string;
    createdTime?: Nullable<string>;
    lastLoginTime?: Nullable<string>;
}

export interface IQuery {
    hello(): string | Promise<string>;
    hello2(): string | Promise<string>;
    getCache(): string | Promise<string>;
    login(loginId: string): Nullable<AccountEntity> | Promise<Nullable<AccountEntity>>;
    getAccountInfo(loginId: string): Nullable<AccountEntity> | Promise<Nullable<AccountEntity>>;
}

export interface IMutation {
    createAccount(createAccountInput?: Nullable<CreateAccountInput>): Nullable<AccountEntity> | Promise<Nullable<AccountEntity>>;
}

type Nullable<T> = T | null;
