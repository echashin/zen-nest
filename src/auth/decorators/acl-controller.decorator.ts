import { constantCase } from 'change-case';

import { AclStorage } from '../classes/acl-storage';
import { ACL_ACTION, ACL_RESOURCE } from '../constants';
import { AclActionDto } from '../dto/acl-action.dto';
import { AclResourceDto } from '../dto/acl-resource.dto';

export function AclController(scope: string, description: string): ClassDecorator {
  return function (target: Function): any {
    const resourceCode: string = constantCase(target.name).replace(/_CONTROLLER$/, '');

    if (!AclStorage[scope]) {
      AclStorage[scope] = { resources: [] };
    }

    if (AclStorage[scope].resources[resourceCode]) {
      throw new Error(`Acl resource already exist ${target.name} ${resourceCode}`);
    }

    const resource: AclResourceDto = {
      code: resourceCode,
      description,
      actions: [],
    };

    for (const propName of Object.getOwnPropertyNames(target.prototype)) {
      const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(target.prototype, propName);
      if (descriptor) {
        const isMethod: boolean = typeof descriptor.value === 'function' && propName !== 'constructor';
        if (!isMethod) continue;

        const keys: string[] = Reflect.getMetadataKeys(descriptor.value);
        if (keys.includes(ACL_ACTION)) {
          const action: AclActionDto = Reflect.getMetadata(ACL_ACTION, descriptor.value);

          if (resource.actions.some(({ code }: AclActionDto) => code === action.code)) {
            throw new Error(`Duplicate AclAction ${action.code} on ${target.name}.${propName} `);
          }
          resource.actions.push(action);
        } else {
          throw new Error(`Method ${target.name}.${propName} dont have AclAction`);
        }
      }
    }

    AclStorage[scope].resources.push(resource);
    Reflect.defineMetadata(ACL_RESOURCE, resource, target);
  };
}
