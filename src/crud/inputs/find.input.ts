import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FindInput {
  @ApiProperty({
    type: String,
    isArray: false,
    description: 'Selects resource fields. <a href="https://github.com/echashin/zen-nest/wiki/zen-nest-crud#select" target="_blank">Docs</a>',
    required: false,
    //format: 'form',
  })
  @Expose()
  fields?: string;

  @ApiProperty({
    type: String,
    isArray: false,
    required: false,
    description: 'Adds search condition. <a href="https://github.com/echashin/zen-nest/wiki/zen-nest-crud#search" target="_blank">Docs</a>',
  })
  @Expose()
  s?: string;

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
    description: 'Adds filter condition. <a href="https://github.com/echashin/zen-nest/wiki/zen-nest-crud#filter" target="_blank">Docs</a>',
  })
  @Expose()
  filter?: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
    description: 'Adds OR condition. <a href="https://github.com/echashin/zen-nest/wiki/zen-nest-crud#or" target="_blank">Docs</a>',
  })
  @Expose()
  or?: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
    description: 'Adds sort by field. <a href="https://github.com/echashin/zen-nest/wiki/zen-nest-crud#sort" target="_blank">Docs</a>',
  })
  @Expose()
  sort?: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
    description: 'Adds relational resources. <a href="https://github.com/echashin/zen-nest/wiki/zen-nest-crud#join" target="_blank">Docs</a>',
  })
  @Expose()
  join?: string[];

  @ApiProperty({
    type: Number,
    isArray: false,
    required: false,
    description: 'Limit amount of resources. <a href="https://github.com/echashin/zen-nest/wiki/zen-nest-crud#limit" target="_blank">Docs</a>',
  })
  @Expose()
  limit?: number;

  @ApiProperty({
    type: Number,
    isArray: false,
    required: false,
    description: 'Page portion of resources. <a href="https://github.com/echashin/zen-nest/wiki/zen-nest-crud#page" target="_blank">Docs</a>',
    example: 1,
  })
  @Expose()
  page?: number;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Load deleted items',
    example: false,
  })
  @Expose()
  softDelete?: boolean;

  // @ApiProperty({
  //   type: Number,
  //   isArray: false,
  //   required: false,
  //   description: 'Reset cache (if was enabled). <a href="https://github.com/echashin/zen-nest/wiki/zen-nest-crud#cache" target="_blank">Docs</a>',
  // })
  // cache?: number;
}
