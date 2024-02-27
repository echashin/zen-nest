import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Exclude()
export class DeviceInfoInput {
  @ApiProperty({ required: true, example: 'jhdi-dssd-fdcv', type: String })
  @IsNotEmpty()
  @IsDefined()
  @Expose()
  deviceId!: string;

  @ApiProperty({ required: false, example: 'desktop', type: String })
  @IsString()
  @Expose()
  deviceType?: string;

  @ApiProperty({ required: false, example: 'some-device', type: String })
  @IsString()
  @IsOptional()
  @Expose()
  deviceName?: string;

  @ApiProperty({ required: false, example: 'some-brand', type: String })
  @IsString()
  @IsOptional()
  @Expose()
  deviceBrand?: string;

  @ApiProperty({ required: false, example: 'windows', type: String })
  @IsString()
  @IsOptional()
  @Expose()
  deviceOs?: string;
}
