import { Inject, Injectable } from '@nestjs/common';
import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { CRYPTO_KEY_LENGTH, ZEN_AUTH_CONFIG_OPTIONS } from '../constants';
import { UserDto } from '../dto';
import { ZenAuthModuleOptions } from '../interface';

@Injectable({})
export class AuthService {
  constructor(@Inject(ZEN_AUTH_CONFIG_OPTIONS) private readonly options: ZenAuthModuleOptions) {}

  findLocalUser(email: string, plainPassword: string): Promise<UserDto> {
    return this.options.authService.findUserByEmailAndPassword(email, this.hashString(plainPassword));
  }

  findLocalUserByTokenAndCode(token: string, code: string): Promise<UserDto> {
    return this.options.authService.findUserByTokenAndCode(token, code);
  }

  findUserByRefreshToken(refreshToken: string, managerId: string, deviceId: string): Promise<UserDto> {
    return this.options.authService.findUserByRefreshToken(this.hashString(refreshToken), managerId, deviceId);
  }

  checkPermissions(role: string, aclResource: string, aclAction: string): Promise<boolean> {
    return this.options.authService.checkPermissions(role, aclResource, aclAction);
  }

  private hashString(password: string): string {
    return crypto.scryptSync(password, this.options.hash_salt, CRYPTO_KEY_LENGTH).toString('hex');
  }

  validateAccessToken(token: string): JwtPayload | string {
    const secret: string = this.options.accessToken.secret;
    return jwt.verify(token, secret, { complete: false });
  }

  validateRefreshToken(token: string): JwtPayload | string {
    const secret: string = this.options.refreshToken.secret;
    return jwt.verify(token, secret, { complete: false });
  }

  decodeRefreshToken(token: string): JwtPayload | string {
    return jwt.decode(token, { complete: false });
  }
}
