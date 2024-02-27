import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { ZEN_USER } from '../constants';
import { UserDto } from '../dto/user.dto';

export const User: (...dataOrPipes: unknown[]) => ParameterDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: any = ctx.switchToHttp().getRequest();
  const user: UserDto = request[ZEN_USER];
  if (!user) {
    throw new UnauthorizedException();
  }
  return user;
});
