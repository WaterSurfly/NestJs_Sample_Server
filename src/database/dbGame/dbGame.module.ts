import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {dbGameConnectionName} from "../database.constants";
import {PlayerEntity} from "./entity/player.entity";
import {PlayerRepository} from "./repository/player.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([PlayerEntity], dbGameConnectionName),
    ],
    providers: [PlayerRepository],
    exports: [TypeOrmModule, PlayerRepository],
})
export class DbGameModule {}
