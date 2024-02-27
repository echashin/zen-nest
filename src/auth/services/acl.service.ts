import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { cloneDeep, difference } from 'lodash';

import { AclStorage } from '../classes/acl-storage';
import { ZEN_AUTH_CONFIG_OPTIONS } from '../constants';
import { AclActionDto, AclDto, AclPermissionDto, AclResourceDto } from '../dto';
import { mapField } from '../helpers/map-field';
import { AclActionInput, AclInput, AclResourceInput } from '../inputs';
import { ZenAuthModuleOptions } from '../interface';

@Injectable()
export class AclService {
  constructor(@Inject(ZEN_AUTH_CONFIG_OPTIONS) private readonly options: ZenAuthModuleOptions) {}

  async getAclForRole(scope: string, roleCode: string, permissions: AclPermissionDto[]): Promise<AclDto> {
    if (!AclStorage[scope]) {
      throw new NotFoundException(`ACL for scope ${scope} not found`);
    }

    const resources: AclResourceDto[] = cloneDeep(AclStorage[scope]).resources.map((resource: AclResourceDto) => ({
      ...resource,
      actions: resource.actions.map((action: AclActionDto) => ({
        ...action,
        allowed: permissions.some((p: AclPermissionDto) => p.resourceCode === resource.code && p.actionCode === action.code) || action.isOpen,
      })),
    }));
    return { resources };
  }

  async filterAclInputs(scope: string, roleCode: string, input: AclInput): Promise<AclPermissionDto[]> {
    this.checkResources(scope, input.resources);
    const acl: AclDto = cloneDeep(AclStorage[scope]);
    const permissions: AclPermissionDto[] = [];

    for (const { code: resourceCode, actions } of input.resources) {
      const aclResource: AclResourceDto = acl.resources.find((res: AclResourceDto) => res.code === resourceCode);

      const allowedActions: AclActionInput[] = actions.filter(
        ({ allowed, code }: AclActionInput) => allowed && aclResource.actions.some((a: AclActionDto) => a.code === code && a.isOpen === false),
      );

      for (const { code: actionCode } of allowedActions) {
        permissions.push({
          actionCode,
          resourceCode,
          roleCode,
        });
      }
    }
    return permissions;
  }

  private checkResources(scope: string, inputResources: AclResourceInput[]): void {
    const acl: AclDto = cloneDeep(AclStorage[scope]);
    for (const { code, actions } of inputResources) {
      const existingResource: AclResourceDto = acl.resources.find((res: AclResourceDto) => res.code === code);

      if (!existingResource) {
        throw new BadRequestException(`Acl resources dont match, please reload form. Resource code: ${code}`);
      }

      const inputActionsCodes: string[] = mapField(actions, 'code');
      const existingActionsCodes: string[] = mapField(existingResource.actions, 'code');
      const diff: string[] = difference(inputActionsCodes, existingActionsCodes);

      if (diff.length > 0) {
        throw new BadRequestException('Acl actions dont match, please reload form. Resource code: ${code}');
      }
    }
  }
}
