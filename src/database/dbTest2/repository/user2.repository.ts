import { EntityRepository, Repository } from 'typeorm';
import { User2Entity } from '../entity/user2.entity';

@EntityRepository(User2Entity)
export class User2Repository extends Repository<User2Entity> {
    constructor() {
        super();
    }
}
