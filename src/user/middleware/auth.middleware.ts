// auth.middleware.ts
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name)
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (token) {
      try {
        const user = jwt.decode(token);
        if (user) {
          req['user'] = user;
        }
      } catch (error) {
        this.logger.error(error)
      }
    }
    next();
  }
}
