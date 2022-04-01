import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserInfoQuery } from './get-user-info.query';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../database/dbTest/entity/user.entity';
import { Repository } from 'typeorm';
import { UserInfo } from '../UserInfo';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../database/dbTest/repository/user.repository';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoHandler implements IQueryHandler<GetUserInfoQuery> {
    constructor(private usersRepository: UserRepository) {}

    async execute(query: GetUserInfoQuery): Promise<UserInfo> {
        const { userId } = query;

        const user = await this.usersRepository.findOne({ id: userId } as any);

        if (!userId) {
            throw new NotFoundException('User does not exist.');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
}
