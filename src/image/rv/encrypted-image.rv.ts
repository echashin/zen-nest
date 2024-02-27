import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDefined, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';

/**
 * Interface for encrypted image row value
 */
@Exclude()
export class EncryptedImageRv {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Encrypted image url',
    example: 'https://google.com/logo.png',
  })
  @IsUrl()
  @IsDefined()
  @Expose()
  encryptedImageUrl!: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Blurred image url',
    example: 'https://google.com/logo.png',
  })
  @IsUrl()
  @IsDefined()
  @Expose()
  blurredImageUrl!: string;

  @ApiProperty({ required: false, type: String, description: 'Encrypted image id in Docs microservice' })
  @IsUUID(4)
  @IsDefined()
  @Expose()
  id!: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Folder path where image is saved',
    example: '/customer/avatars',
  })
  @IsString()
  @IsDefined()
  @Expose()
  path!: string;

  @ApiProperty({ required: false, type: String, description: 'Image extension', example: 'png' })
  @IsDefined()
  @Expose()
  ext!: string;

  @ApiProperty({ required: false, type: String, description: 'Url of image server', example: 'docs.api.com' })
  @IsUrl()
  @IsDefined()
  @Expose()
  serverUrl!: string;

  /**
   * If the image was imported and saved not on our server we have to save possible errors during the transfer
   */
  @ApiProperty({ type: Object, required: false, description: 'Errors for external images' })
  @Expose()
  @IsDefined()
  uploadError?: Object;

  @ApiProperty({ required: true, type: Date })
  @IsDefined()
  @Expose()
  expires?: Date;

  @ApiProperty({ required: true, type: String })
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
