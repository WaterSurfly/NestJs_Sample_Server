import { EntityRepository, Repository } from 'typeorm';
import { PlayerEntity } from '../entity/player.entity';

@EntityRepository(PlayerEntity)
export class PlayerRepository extends Repository<PlayerEntity> {
    constructor() {
        super();
    }
}
