import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { AccessTokenGuard } from '../guards/access-token.guard';
import { AclGuard } from '../guards/acl.guard';
import { AuthAction } from './auth-action.decorator';

export function Auth(description: string, isOpen: boolean = false): any {
  return applyDecorators(
    ApiOperation({ summary: description }),
    ApiBearerAuth('access-token'),
    AuthAction(description, isOpen),
    UseGuards(AccessTokenGuard, AclGuard),
  );
}
