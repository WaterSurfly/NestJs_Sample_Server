import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './common/auth/auth.service';
import {GqlContextType, GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        let request, info;
        const contextType = context.getType()
        if(contextType === 'http') {
            request = context.switchToHttp().getRequest();
        }

        if(context.getType<GqlContextType>() === 'graphql') {
            const ctx = GqlExecutionContext.create(context);
            request = ctx.getContext().req;
            info = ctx.getArgByIndex(1);
        }

        return this.validateRequest(request, info);
    }

    private validateRequest(request: Request, info?: any) {
        const auth = request.headers.authorization;
        if(!auth) {
            throw new UnauthorizedException();
        }
        const jwtString = auth.split('Bearer ')[1];
        this.authService.verifyToken(jwtString, info);
        return true;
    }
}
