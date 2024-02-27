import { ApiProperty } from '@nestjs/swagger';

import { CrudColumnTypeEnum } from '../enums/crud-column-type.enum';

class CustomSwaggerParameters {
  'x-crud-column'!: CrudColumnTypeEnum;
}

type SwaggerDecoratorParams = Parameters<typeof ApiProperty>;
type SwaggerDecoratorMetadata = SwaggerDecoratorParams[0];
type CrudColumnApiPropertyMetadata = SwaggerDecoratorMetadata & CustomSwaggerParameters;

export const CrudApiProperty: (params: CrudColumnApiPropertyMetadata) => (target: Object, propertyKey: string | symbol) => void = (
  params: CrudColumnApiPropertyMetadata,
) => {
  return ApiProperty(params);
};
