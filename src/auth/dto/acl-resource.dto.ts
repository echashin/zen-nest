import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDefined, IsString, ValidateNested } from 'class-validator';

import { AclActionDto } from './acl-action.dto';

@Exclude()
export class AclResourceDto {
  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsDefined()
  @Expose()
  description!: string;

  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsDefined()
  @Expose()
  code!: string;

  @ApiProperty({ type: () => [AclActionDto], required: true })
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AclActionDto)
  @IsDefined()
  @Expose()
  actions!: AclActionDto[];
}
