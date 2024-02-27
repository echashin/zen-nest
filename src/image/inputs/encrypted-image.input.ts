import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDefined, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';

import { ImageInput } from './image.input';

@Exclude()
export class EncryptedImageInput {
  @ApiProperty({ required: true, type: String })
  @IsUUID(4)
  @IsDefined()
  @Expose()
  id!: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsDefined()
  @Expose()
  path!: string;

  @ApiProperty({ required: true, type: String })
  @IsDefined()
  @IsString()
  @Expose()
  ext!: string;

  @ApiProperty({ required: true, type: String })
  @IsUrl()
  @IsDefined()
  @Expose()
  serverUrl!: string;

  @ApiProperty({ required: true, type: String })
  @IsUrl()
  @IsDefined()
  @Expose()
  encryptedImageUrl!: string;

  @ApiProperty({ required: true, type: String })
  @IsUrl()
  @IsDefined()
  @Expose()
  blurredImageUrl!: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsDefined()
  @Expose()
  key!: string;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsDefined()
  @Expose()
  width!: number;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsDefined()
  @Expose()
  height!: number;
}
