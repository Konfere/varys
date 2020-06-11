import Knex from 'knex';
import { FactRepository, NamespaceRepository } from '@varys/domain';
import { FactPgRepository, NamespacePgRepository } from '@varys/adapter-pg';
import { AtomicRepositoryContext } from '../AtomicRepositoryContext';

export class AtomicPgRepositoryContext implements AtomicRepositoryContext {

    readonly factRepository: FactRepository;

    readonly namespaceRepository: NamespaceRepository;

    constructor(private readonly transaction: Knex.Transaction) {

        this.factRepository = new FactPgRepository(transaction, 'facts');

        this.namespaceRepository = new NamespacePgRepository(transaction, 'facts');
    }

    async commit(): Promise<void> {
        await this.transaction.commit();
    }

    async rollback(): Promise<void> {
        await this.transaction.rollback();
    }
}
