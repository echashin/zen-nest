import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDefined, IsString, IsUrl, IsUUID } from 'class-validator';

@Exclude()
export class ImageInput {
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
  url!: string;
}
