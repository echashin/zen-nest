import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsDefined, ValidateNested } from 'class-validator';

import { AclResourceInput } from './acl-resource.input';

@Exclude()
export class AclInput {
  @ApiProperty({ isArray: true, type: () => AclResourceInput, required: true })
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => AclResourceInput)
  @Expose()
  resources!: AclResourceInput[];
}
