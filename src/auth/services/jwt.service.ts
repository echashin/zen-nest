import { Inject, Injectable } from '@nestjs/common';
import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { CRYPTO_KEY_LENGTH, ZEN_AUTH_CONFIG_OPTIONS } from '../constants';
import { AccessTokenPayload, ZenAuthModuleOptions, RefreshTokenPayload } from '../interface';

@Injectable({})
export class JwtService {
  constructor(@Inject(ZEN_AUTH_CONFIG_OPTIONS) private readonly options: ZenAuthModuleOptions) {}

  signAccessToken(payload: AccessTokenPayload): string {
    const secret: string = this.options.accessToken.secret;
    const expiresIn: string = this.options.accessToken.expires;
    return jwt.sign(payload, secret, { algorithm: 'HS512', expiresIn });
  }

  validateAccessToken(token: string): JwtPayload | string {
    const secret: string = this.options.accessToken.secret;
    return jwt.verify(token, secret, { complete: false });
  }

  signRefreshToken(payload: RefreshTokenPayload): string {
    const secret: string = this.options.refreshToken.secret;
    const expiresIn: string = this.options.refreshToken.expires;
    return jwt.sign(payload, secret, { algorithm: 'HS512', expiresIn });
  }

  validateRefreshToken(token: string): JwtPayload | string {
    const secret: string = this.options.refreshToken.secret;
    return jwt.verify(token, secret, { complete: false });
  }

  hashString(text: string): string {
    return crypto.scryptSync(text, this.options.hash_salt, CRYPTO_KEY_LENGTH).toString('hex');
  }
}
