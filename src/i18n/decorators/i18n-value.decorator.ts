import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export function I18nValueDecorator(required: boolean): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiProperty({
      required: required,
      description: 'Multi-language text value',
      type: 'object',
      example: { AR: 'فيتر', EN: 'Wind', DE: 'Wind' },
      additionalProperties: { type: 'string' },
    }),
  );
}
