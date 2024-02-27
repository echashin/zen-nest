import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDefined, IsUrl } from 'class-validator';

@Exclude()
export class EncryptedImageDto {
  @ApiProperty({
    example: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    required: true,
    type: String,
    description: 'Src of the encrypted image',
  })
  @IsUrl()
  @IsDefined()
  @Expose()
  url!: string;

  @ApiProperty({
    example: 'https://dev.api.com/customer/docs/',
    required: true,
    type: String,
    description: 'Url to get the image key for decryption',
  })
  @IsUrl()
  @IsDefined()
  @Expose()
  keyUrl!: string;
}
