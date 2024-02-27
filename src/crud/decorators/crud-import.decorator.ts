import { applyDecorators, Post } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiExtension, ApiExtraModels, ApiOperation } from '@nestjs/swagger';

import { ImportErrorDto } from '../dto';
import { ImportDto } from '../dto/import.dto';
import { CrudMethodsEnum } from '../enums/crud-methods.enum';
import { InputError } from '../interfaces/input-error';

export function CrudImport(path: string = 'import'): any {
  return applyDecorators(
    Post(path),
    ApiOperation({ summary: `Import multiple items by file upload` }),
    ApiConsumes('multipart/form-data'),
    ApiExtension('x-crud-method', { type: CrudMethodsEnum.import }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['file'],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiExtraModels(ImportDto, ImportErrorDto, InputError),
    ApiCreatedResponse({ type: ImportDto }),
  );
}
