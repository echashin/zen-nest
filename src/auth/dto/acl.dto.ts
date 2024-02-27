import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsDefined, ValidateNested } from 'class-validator';

import { AclResourceDto } from './acl-resource.dto';

@Exclude()
export class AclDto {
  @ApiProperty({ type: () => [AclResourceDto], required: true })
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => AclResourceDto)
  @Expose()
  resources!: AclResourceDto[];
}
