import Router, { RouterContext } from '@koa/router';
import { OK } from 'http-status-codes';
import { NamespaceRoute } from '@varys/api-model';
import { Controller } from '../../../service/Controller';
import { NamespaceService } from '../../../service/NamespaceService';
import { namespaceToDTO } from '../../../service/DtoUtils';
import { FactsRootController } from './facts/FactsRootController';
import { validateParams } from '../../../service/RequestValidator';
import { FactService } from '../../../service/FactService';

export class NamespacesController implements Controller {

    constructor(
        private readonly namespaceService: NamespaceService,
        private readonly factService: FactService
    ) {
    }

    rootPath(): string {
        return NamespaceRoute.relativePath;
    }

    children(): Controller[] {
        return [
            new FactsRootController(this.factService)
        ];
    }

    mount(router: Router): void {
        router.all('/', validateParams(NamespaceRoute.Params));
        router.get('/', this.find.bind(this));
    }

    async find({ request, response, params }: RouterContext) {

        const { blackboard, namespace: reference } = params as NamespaceRoute.Params;

        const namespace = await this.namespaceService.findByReference(reference, blackboard);

        response.status = OK;
        response.body = namespaceToDTO(namespace);
    }
}
