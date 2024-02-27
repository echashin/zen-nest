import { applyDecorators, Post, UseInterceptors } from '@nestjs/common';
import { ApiExtension, ApiExtraModels, ApiOkResponse, ApiOperation, ApiProduces } from '@nestjs/swagger';

import { CrudMethodsEnum } from '../enums/crud-methods.enum';
import { TransferFileTypeEnum } from '../enums/transfer-file-type.enum';
import { ExportFileInput } from '../inputs';
import { ExportContentTypeInterceptor } from '../interceptors/export-content-type.interceptor';

export function CrudExport(path: string = 'export'): any {
  return applyDecorators(
    Post(path),
    ApiOperation({ summary: `Export items to file` }),
    ApiExtension('x-crud-method', { type: CrudMethodsEnum.export }),
    ApiExtraModels(ExportFileInput),
    ApiOkResponse({
      schema: {
        type: 'string',
        format: 'binary',
      },
    }),
    ApiProduces(`application/${TransferFileTypeEnum.json}`, `application/${TransferFileTypeEnum.ods}`, `application/${TransferFileTypeEnum.xlsx}`),
    UseInterceptors(ExportContentTypeInterceptor),
  );
}
