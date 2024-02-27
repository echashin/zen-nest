import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsDefined, IsString } from 'class-validator';

@Exclude()
export class AclActionInput {
  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsDefined()
  @Expose()
  code!: string;

  @ApiProperty({ required: true, type: Boolean })
  @IsBoolean()
  @IsDefined()
  @Expose()
  allowed!: boolean;
}
