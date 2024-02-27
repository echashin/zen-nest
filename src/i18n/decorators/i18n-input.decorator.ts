import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { I18nValidator } from '../validators/i18n.validator';

export function I18nInputDecorator(required: boolean): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiProperty({
      required: required,
      description: 'Multi-language text input',
      type: 'object',
      example: { AR: 'فيتر', EN: 'Wind', DE: 'Wind' },
      additionalProperties: { type: 'string' },
    }),
    I18nValidator(required),
  );
}
