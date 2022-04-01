import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository])],
    providers: [UserRepository],
    exports: [TypeOrmModule, UserRepository],
})
export class DbTestModule {}
