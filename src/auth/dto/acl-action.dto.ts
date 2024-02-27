import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

@Exclude()
export class AclActionDto {
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

  @ApiProperty({ required: true, type: Boolean, description: 'Action open for all roles' })
  @IsBoolean()
  @IsDefined()
  @Expose()
  isOpen!: boolean;

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  @Expose()
  allowed?: boolean;
}
