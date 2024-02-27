import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsDefined, IsUrl, ValidateNested } from 'class-validator';

import { ThumbDto } from './thumb.dto';

@Exclude()
export class ImageDto {
  @ApiProperty({
    example: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    required: true,
    type: String,
  })
  @IsUrl()
  @IsDefined()
  @Expose()
  url!: string;

  @ApiProperty({ isArray: true, required: true, type: ThumbDto })
  @ValidateNested({ each: true })
  @Type(() => ThumbDto)
  @IsArray()
  @IsDefined()
  @Expose()
  thumbs!: ThumbDto[];
}
