import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty } from 'class-validator';
import { <%= classify(name) %>Entity } from '../entity/<%= dasherize(name) %>.entity'

@Exclude()
export class <%= classify(name) %>CreateInput extends MetaCreateInput {
  @ApiProperty({ required: true, type: String })
  @UniqueField(<%= classify(name) %>Entity)
  @IsNotEmpty()
  @IsDefined()
  @Expose()
  code?: string;
}