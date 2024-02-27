import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { LocalGuard } from '../guards/local.guard';
import { AuthAction } from './auth-action.decorator';

export function AuthLocal(description: string): any {
  return applyDecorators(ApiOperation({ summary: description }), ApiBearerAuth('access-token'), UseGuards(LocalGuard), AuthAction(description, true));
}
