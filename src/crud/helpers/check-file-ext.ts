import { BadRequestException } from '@nestjs/common';

import { TransferFileTypeEnum } from '../enums/transfer-file-type.enum';

export function checkFileExt(fileExt: string): void {
  if (!(Object.values(TransferFileTypeEnum) as string[]).includes(fileExt.toLowerCase())) {
    throw new BadRequestException('Not supported file format');
  }
}
