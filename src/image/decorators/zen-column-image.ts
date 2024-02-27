import { applyDecorators } from '@nestjs/common';
import { Column } from 'typeorm';
import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';

import { ImageRv } from '../rv';
import { IMAGE_MODULE_STORAGE } from '../storage/image-module.storage';

export function ZenColumnImage(path: string, options: ColumnOptions = {}): any {
  let init: boolean = true;
  return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<ImageRv | ImageRv[]>): any => {
    let isArray: boolean = false;
    if (init) {
      const propertyType: any = Reflect.getMetadata('design:type', target, key);

      if (propertyType.name === 'Array') {
        isArray = true;
      } else {
        if (propertyType.name !== 'ImageRv') {
          throw new Error(`Wrong property type at ${target.constructor.name}.${key.toString()}. Property type must be ImageRv`);
        }
      }
      IMAGE_MODULE_STORAGE.set(
        { entityName: target.constructor.name, originalField: key.toString() },
        {
          isArray,
          path,
        },
      );
      init = false;
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
