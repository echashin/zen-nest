import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';

import { ACL_ACTION, ACL_RESOURCE, ZEN_AUTH_SCOPE, ZEN_USER } from '../constants';
import { AclActionDto } from '../dto/acl-action.dto';
import { AclResourceDto } from '../dto/acl-resource.dto';
import { UserDto } from '../dto/user.dto';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AclGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();

    const user: UserDto = request[ZEN_USER];
    if (!user) {
      return false;
    }

    if (user.role.toUpperCase() === 'DEVELOPER') {
      return true;
    }

    const scope: string = this.reflector.get<string>(ZEN_AUTH_SCOPE, context.getClass());

    if (!scope) {
      return false;
    }

    const action: AclActionDto = this.reflector.get<AclActionDto>(ACL_ACTION, context.getHandler());
    if (action.isOpen) {
      return true;
    }

    const resource: AclResourceDto = this.reflector.get<AclResourceDto>(ACL_RESOURCE, context.getClass());

    const authService: AuthService = await this.moduleRef.get(`ZEN_AUTH_${scope.toUpperCase()}`, { strict: false });

    return await authService.checkPermissions(user.role, resource.code, action.code);
  }
}
