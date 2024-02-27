import { applyDecorators } from '@nestjs/common';
import { Column } from 'typeorm';

import { CollectExpiringColumn } from './collect-expiring-column';

export function ExpiringColumn(): ReturnType<typeof applyDecorators> {
  return applyDecorators(Column({ type: 'timestamp' }), CollectExpiringColumn());
}
