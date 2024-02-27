import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';

import { ZEN_AUTH_SCOPE, ZEN_USER } from '../constants';
import { AuthService } from '../services/auth.service';

@Injectable()
export class PhoneLocalGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const scope: string = this.reflector.get<string>(ZEN_AUTH_SCOPE, context.getClass());

    if (!scope) {
      return false;
    }
    const authService: AuthService = await this.moduleRef.get(`ZEN_AUTH_${scope.toUpperCase()}`, { strict: false });
    const req: any = context.switchToHttp().getRequest();
    const token: string = req['body']['token'];
    const code: string = req['body']['code'];

    if (!token || !code) {
      throw new UnauthorizedException();
    }

    req[ZEN_USER] = await authService.findLocalUserByTokenAndCode(token, code);
    return true;
  }
}
