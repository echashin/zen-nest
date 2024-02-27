import { constantCase } from 'change-case';

import { ACL_ACTION } from '../constants';

export function AuthAction(description: string, isOpen: boolean): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
    Reflect.defineMetadata(ACL_ACTION, { code: constantCase(propertyKey), description, isOpen }, descriptor.value);
  };
}
