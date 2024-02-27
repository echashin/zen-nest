import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsDefined, IsJWT, IsNotEmpty, ValidateNested } from 'class-validator';

import { DeviceInfoInput } from './device-info.input';

@Exclude()
export class RefreshTokenInput {
  @ApiProperty({ required: true, type: String })
  @IsJWT()
  @IsNotEmpty()
  @IsDefined()
  @Expose()
  refreshToken: string;

  @ApiProperty({ required: true, type: DeviceInfoInput })
  @ValidateNested()
  @Type(() => DeviceInfoInput)
  @Expose()
  deviceInfo!: DeviceInfoInput;
}
