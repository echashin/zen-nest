import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';

import { ZEN_AUTH_SCOPE, ZEN_USER } from '../constants';
import { DeviceInfoInput } from '../inputs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const scope: string = this.reflector.get<string>(ZEN_AUTH_SCOPE, context.getClass());
    if (!scope) {
      throw new UnauthorizedException(`ZEN_AUTH_SCOPE not found`);
    }
    const authService: AuthService = await this.moduleRef.get(`ZEN_AUTH_${scope.toUpperCase()}`, { strict: false });
    const req: any = context.switchToHttp().getRequest();
    const token: string = req['body']['refreshToken'];
    const deviceInfo: DeviceInfoInput = req['body']['deviceInfo'];
    if (!token) {
      throw new UnauthorizedException('Refresh token not found in request.body');
    }
    if (!deviceInfo) {
      throw new UnauthorizedException('Device info not found in request.body');
    }

    try {
      const data: { userId: string } = authService.decodeRefreshToken(token) as { userId: string };
      req[ZEN_USER] = authService.findUserByRefreshToken(token, data.userId, deviceInfo.deviceId);
    } catch {
      throw new UnauthorizedException('Refresh token is not valid');
    }

    return true;
  }
}
