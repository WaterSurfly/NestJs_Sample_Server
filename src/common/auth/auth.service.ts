import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import authConfig from '../../config/auth-config';
import { ConfigType } from '@nestjs/config';

interface User {
    id: string;
    name: string;
    email: string;
}

interface User4Guest {
    id: string;
    accountId: string;
    reqTime: string;
}

@Injectable()
export class AuthService {
    constructor(
        @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
    ) {}

    login(user: User) {
        const payload = { ...user };

        return jwt.sign(payload, this.config.jwtSecret, {
            expiresIn: '1d',
            audience: 'example.com',
            issuer: 'example.com',
        });
    }

    verify(jwtString: string) {
        try {
            const payload = jwt.verify(jwtString, this.config.jwtSecret) as (
                | jwt.JwtPayload
                | string
            ) &
                User;

            const { id, email } = payload;

            return {
                userId: id,
                email,
            };
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

    generateToken(user: User4Guest) {
        const payload = { ...user };

        return jwt.sign(payload, this.config.jwtSecret, {
            expiresIn: '1d',
            audience: 'http://127.0.0.1:3000',
            issuer: 'com.app.guest',
        });
    }

    verifyToken(jwtString: string, info: any) {
        try {
            const payload = jwt.verify(jwtString, this.config.jwtSecret) as (
                | jwt.JwtPayload
                | string
            ) &
                User4Guest;

            const { id, accountId, reqTime } = payload;

            if (!info) {
                throw new UnauthorizedException();
            }

            if (info.accountId !== Number(accountId)) {
                throw new UnauthorizedException();
            }

            return {
                id,
                reqTime,
            };
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}
