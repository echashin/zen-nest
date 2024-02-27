import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDefined, IsNumber, IsUrl } from 'class-validator';

@Exclude()
export class ThumbDto {
  @ApiProperty({ example: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', required: true, type: String })
  @IsUrl()
  @IsDefined()
  @Expose()
  thumbUrl!: string;

  @ApiProperty({ example: 50, required: true, type: Number, description: 'Image width in px' })
  @IsNumber()
  @IsDefined()
  @Expose()
  size!: number;
}
