import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsNotEmpty } from 'class-validator';
import { <%= classify(name) %>Entity } from '../entity/<%= dasherize(name) %>.entity'

@Exclude()
export class <%= classify(name) %>UpdateInput extends MetaUpdateInput {
  @ApiProperty({ required: false, type: String })
  @UniqueField(<%= classify(name) %>Entity)
  @IsNotEmpty()
  @IsOptional()
  @Expose()
  code?: string;
}