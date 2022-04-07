import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { map, Observable, tap } from 'rxjs';

//export interface Response<T> {
//    result: T;
//}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private logger: Logger) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const contextType = context.getType();
        if (contextType === 'http') {
            const { method, url, body } = context.getArgByIndex(0);
            this.logger.log(
                `Request to ${method} ${url} ${JSON.stringify(body)}`,
            );

            return next.handle().pipe(
                map((result) => {
                    return { result };
                }),

                tap((data) =>
                    this.logger.log(
                        `Response from ${method} ${url} \n response: ${JSON.stringify(
                            data,
                        )}`,
                    ),
                ),
            );
        }

        if (context.getType<GqlContextType>() === 'graphql') {
            const gqlContext = GqlExecutionContext.create(context);
            const args = gqlContext.getArgByIndex(1);
            const info = gqlContext.getInfo();
            const { key, typename } = info.path;
            this.logger.log(
                `Request GraphQL to ${typename} / ${key} / ${JSON.stringify(
                    args,
                )}`,
            );

            return next.handle().pipe(
                map((data) => {
                    if (data && typeof data === 'object') {
                        data['key'] = key ? key : '';
                        data['typename'] = typename ? typename : '';
                        return data;
                    }
                }),
                tap((data) =>
                    this.logger.log(
                        `Response GraphQL from ${typename} : ${key} \n response: ${JSON.stringify(
                            data,
                        )}`,
                    ),
                ),
            );
        }
    }
}
