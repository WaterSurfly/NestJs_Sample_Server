import { EntityRepository, Repository } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
    constructor() {
        super();
    }
}
