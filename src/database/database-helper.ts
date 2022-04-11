import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Connection } from 'typeorm/connection/Connection';

async function ExecDbTransactionUsingQueryRunner<T>(
    conn: Connection,
    entities: T[],
    logger,
): Promise<boolean> {
    const queryRunner = conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        for (const entity of entities) {
            await queryRunner.manager.save(entity);
        }
        //throw new InternalServerErrorException(); // forced error
        await queryRunner.commitTransaction();
        return true;
    } catch (e) {
        logger.error(e);
        await queryRunner.rollbackTransaction();
        return false;
    } finally {
        await queryRunner.release();
    }
}

async function ExecDbTransaction<R, T>(
    repo: Repository<R>,
    entities: T[],
): Promise<boolean> {
    if (entities.length === 0) {
        return false;
    }

    for (const entity of entities) {
        await repo.manager.transaction(async (manager) => {
            //throw new InternalServerErrorException(); // forced error
            await manager.save(entity);
        });
    }
    return true;
}

export { ExecDbTransactionUsingQueryRunner, ExecDbTransaction };
