import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { AuthAction } from './auth-action.decorator';

export function AuthRefresh(description: string): any {
  return applyDecorators(
    ApiOperation({ summary: description }),
    ApiBearerAuth('access-token'),
    UseGuards(RefreshTokenGuard),
    AuthAction(description, true),
  );
}
