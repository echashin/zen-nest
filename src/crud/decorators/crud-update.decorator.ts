import { applyDecorators, Patch, Type, UseInterceptors } from '@nestjs/common';
import { ApiExtension, ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';

import { CrudMethodsEnum } from '../enums/crud-methods.enum';
import { CrudPatchInterceptor } from '../interceptors';

export const CrudUpdate: any = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOperation({ summary: `Update item ${model.name}` }),
    ApiExtension('x-crud-method', { type: CrudMethodsEnum.update }),
    ApiOkResponse({
      schema: {
        title: `${model.name}`,
        $ref: getSchemaPath(model),
      },
    }),
    UseInterceptors(CrudPatchInterceptor),
    Patch(':id'),
  );
};
