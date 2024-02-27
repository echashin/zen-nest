import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

export class AclPermissionDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsDefined()
  actionCode!: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsDefined()
  @Expose()
  resourceCode!: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsDefined()
  @Expose()
  roleCode!: string;
}
