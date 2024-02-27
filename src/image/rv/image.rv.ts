import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDefined, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

/**
 * Interface for image row value
 */
@Exclude()
export class ImageRv {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Full image url, can be used for external images',
    example: 'https://google.com/logo.png',
  })
  @IsUrl()
  @IsDefined()
  @Expose()
  url!: string;

  @ApiProperty({ required: false, type: String, description: 'Image id in Docs microservice' })
  @IsUUID(4)
  @IsOptional()
  @Expose()
  id?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Folder path where image is saved',
    example: '/customer/avatars',
  })
  @IsString()
  @IsOptional()
  @Expose()
  path?: string;

  @ApiProperty({ required: false, type: String, description: 'Image extension', example: 'png' })
  @IsOptional()
  @Expose()
  ext?: string;

  @ApiProperty({ required: false, type: String, description: 'Url of image server', example: 'docs.api.com' })
  @IsUrl()
  @IsOptional()
  @Expose()
  serverUrl?: string;

  /**
   * If the image was imported and saved not on our server we have to save possible errors during the transfer
   */
  @ApiProperty({ type: Object, required: false, description: 'Errors for external images' })
  @Expose()
  @IsOptional()
  uploadError?: Object;
}
