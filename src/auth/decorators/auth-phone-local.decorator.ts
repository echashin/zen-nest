import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { PhoneLocalGuard } from '../guards/phone-local.guard';
import { AuthAction } from './auth-action.decorator';

export function AuthPhoneLocal(description: string): any {
  return applyDecorators(
    ApiOperation({ summary: description }),
    ApiBearerAuth('access-token'),
    UseGuards(PhoneLocalGuard),
    AuthAction(description, true),
  );
}
