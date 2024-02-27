import { registerDecorator, ValidationOptions } from 'class-validator';

import { I18nRule } from './i18n.rule';

export function I18nValidator(required: boolean, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      name: 'I18nValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [required],
      validator: I18nRule,
      async: true,
    });
  };
}
