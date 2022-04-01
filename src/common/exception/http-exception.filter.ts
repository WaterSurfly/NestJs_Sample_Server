import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GqlContextType } from '@nestjs/graphql';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private logger: Logger) {}
    catch(exception: Error, host: ArgumentsHost) {
        const getType = host.getType();

        if (getType === 'http') {
            const ctx = host.switchToHttp();
            const res = ctx.getResponse<Response>();
            const req = ctx.getRequest<Request>();
            const stack = exception.stack;

            if (!(exception instanceof HttpException)) {
                exception = new InternalServerErrorException();
            }

            const response = (exception as HttpException).getResponse();

            const log = {
                timeStamp: new Date(),
                url: req.url,
                response,
                stack,
            };

            this.logger.error(log);

            res.status((exception as HttpException).getStatus()).json(response);
        }
    }
}
