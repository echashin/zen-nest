import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDefined, IsJWT } from 'class-validator';

@Exclude()
export class TokensDto {
  @ApiProperty({ type: String, required: true })
  @IsJWT()
  @IsDefined()
  @Expose()
  accessToken!: string;

  @ApiProperty({ type: String, required: true })
  @IsJWT()
  @IsDefined()
  @Expose()
  refreshToken!: string;
}
