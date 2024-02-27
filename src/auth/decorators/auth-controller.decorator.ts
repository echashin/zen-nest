import { applyDecorators, SetMetadata } from '@nestjs/common';

import { ZEN_AUTH_SCOPE } from '../constants';
import { AclController } from './acl-controller.decorator';

export function AuthController(scope: string, description: string): any {
  return applyDecorators(SetMetadata(ZEN_AUTH_SCOPE, scope), AclController(scope, description));
}
