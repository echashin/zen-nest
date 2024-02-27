import { applyDecorators } from '@nestjs/common';
import { Column } from 'typeorm';
import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';

import { ImageRv } from '../rv';

export function ZenColumnEncryptedImage(path: string, options: ColumnOptions = {}): any {
  return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<ImageRv | ImageRv[]>): any => {
    let isArray: boolean = false;

    const propertyType: any = Reflect.getMetadata('design:type', target, key);
    if (propertyType.name === 'Array') {
      isArray = true;
    } else {
      if (propertyType.name !== 'EncryptedImageRv') {
        throw new Error(`Wrong property type at ${target.constructor.name}.${key.toString()}. Property type must be EncryptedImageRv`);
      }
    }

    const defaultColumnOption: ColumnOptions = isArray
      ? {
          type: 'jsonb',
          default: () => "'[]'",
          nullable: false,
        }
      : {
          type: 'jsonb',
          nullable: true,
        };

    return applyDecorators(
      Column({
        ...options,
        ...defaultColumnOption,
      }),
    )(target, key, descriptor);
  };
}
