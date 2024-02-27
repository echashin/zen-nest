import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDefined, IsString, ValidateNested } from 'class-validator';

import { AclActionInput } from './acl-action.input';

export class AclResourceInput {
  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsDefined()
  @Expose()
  code!: string;

  @ApiProperty({ type: () => AclActionInput, required: true, isArray: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => AclActionInput)
  @Expose()
  actions!: AclActionInput[];
}
