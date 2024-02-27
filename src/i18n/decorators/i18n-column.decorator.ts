import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Column, ColumnOptions } from 'typeorm';

export function I18nColumnDecorator(options: ColumnOptions = {}): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiProperty({
      required: false,
      description: 'Multi-language column',
      type: 'object',
      example: { AR: 'فيتر', EN: 'Wind', DE: 'Wind' },
      additionalProperties: { type: 'string' },
    }),
    Column({
      type: 'jsonb',
      comment: 'Multi-language column',
      nullable: options.nullable || false,
      ...options,
    }),
  );
}
