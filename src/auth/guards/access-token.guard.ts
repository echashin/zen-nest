import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { JwtPayload } from 'jsonwebtoken';

import { ZEN_AUTH_SCOPE, ZEN_USER } from '../constants';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const scope: string = this.reflector.get<string>(ZEN_AUTH_SCOPE, context.getClass());
    if (!scope) {
      throw new UnauthorizedException(`ZEN_AUTH_SCOPE not found`);
    }
    const authService: AuthService = await this.moduleRef.get(`ZEN_AUTH_${scope.toUpperCase()}`, { strict: false });
    const req: any = context.switchToHttp().getRequest();
    const token: string = req.headers['authorization'];
    if (!token) {
      throw new UnauthorizedException('Access token not found in headers');
    }
    try {
      const data: JwtPayload | string = authService.validateAccessToken(token.split(' ')[1]);
      req[ZEN_USER] = {
        userId: data['userId'],
        role: data['role'],
        language: data['language'],
      };
    } catch {
      throw new UnauthorizedException('Access token not valid');
    }

    return true;
  }
}
