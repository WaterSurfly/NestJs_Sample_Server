import { Request, Response, NextFunction } from 'express';

export function GlobalLoggerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.log('Global Log...');
    next();
}
