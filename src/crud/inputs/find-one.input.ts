import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FindOneInput {
  @ApiProperty({
    type: String,
    isArray: false,
    description: 'Selects resource fields. <a href="https://github.com/echashin/zen-nest/wiki/zen-nest-crud#select" target="_blank">Docs</a>',
    required: false,
  })
  @Expose()
  fields?: string;

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
    description: 'Adds relational resources. <a href="https://github.com/echashin/zen-nest/wiki/zen-nest-crud#join" target="_blank">Docs</a>',
  })
  @Expose()
  join?: string[];

  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Load deleted items',
    example: false,
  })
  @Expose()
  softDelete?: boolean;
}
