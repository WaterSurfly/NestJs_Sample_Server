import {UseGuards} from '@nestjs/common';
import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {PlayerService} from './player.service';
import {AuthGuard} from '../../auth.guard';
import {GetPlayerInfoOutput} from './output/player-output.dto';

@Resolver('player')
export class PlayerResolver {
    constructor(private playerService: PlayerService) {
    }

    // Second (Add token in request.headers.authorization)
    // ex) { "Authorization":"Bearer :tokenString "}
    @UseGuards(AuthGuard) // jwt verify
    @Query(() => GetPlayerInfoOutput)
    async getPlayerInfo(
        @Args('accountId', {type: () => Number}) accountId: number,
    ) {
        return this.playerService.getPlayerInfo(accountId);
    }
}
