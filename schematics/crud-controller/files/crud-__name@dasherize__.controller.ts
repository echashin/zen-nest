import {
  convertFileToJson,
  convertJsonToFile,
  CrudController,
  CrudCreate,
  CrudDeleteMany,
  CrudDeleteOne,
  CrudExport,
  CrudFind,
  CrudFindOne,
  CrudImport,
  CrudImportFile,
  CrudRequest,
  CrudService,
  CrudUpdate,
  ExportFileInput,
  ImportDto,
  Pageable,
  ParsedRequest,
} from 'zen-nest/lib/crud';
import { Body, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { FindOptionsWhere, In, Repository } from 'typeorm';

@CrudController(<%= classify(name) %>Entity)
export class Crud<%= classify(name) %>Controller {
  private service: CrudService<<%= classify(name) %>Entity>;

  constructor(
    @InjectRepository(<%= classify(name) %>Entity)
    private readonly repository: Repository<<%= classify(name) %>Entity>,
  ) {
    this.service = new CrudService<<%= classify(name) %>Entity>(repository, {});
  }

  @CrudFind(<%= classify(name) %>Entity)
  async find(@ParsedRequest() req: CrudRequest): Promise<Pageable<<%= classify(name) %>Entity>> {
    return this.service.crudGetMany(req);
  }

  @CrudFindOne(<%= classify(name) %>Entity)
  async findOne(@Param('id') id: string, @ParsedRequest() req: CrudRequest): Promise<<%= classify(name) %>Entity> {
    return this.service.crudGetOne(id, req);
  }

  @CrudCreate(<%= classify(name) %>Entity)
  async create(@Body() input: <%= classify(name) %>CreateInput): Promise<<%= classify(name) %>Entity> {
    return this.service.create(plainToInstance(<%= classify(name) %>Entity, input));
  }

  @CrudUpdate(<%= classify(name) %>Entity)
  async update(@Param('id') id: string, @Body() input: <%= classify(name) %>UpdateInput): Promise<<%= classify(name) %>Entity> {
    return this.service.update(id, plainToInstance(<%= classify(name) %>Entity, input));
  }

  @CrudDeleteMany()
  async deleteMany(@Query('ids') ids: string[]): Promise<number> {
    return this.service.delete(ids);
  }

  @CrudDeleteOne()
  async delete(@Param('id') id: string): Promise<number> {
    return this.service.delete(id);
  }

  @CrudImport()
  async import(@CrudImportFile() file: { buffer: Buffer; filename: string; mimetype: string }): Promise<ImportDto> {
    return await this.service.import(<%= classify(name) %>CreateInput, convertFileToJson<<%= classify(name) %>CreateInput>(file.buffer, file.filename.split('.').pop()));
  }

  @CrudExport()
  async export(@Body() { ids, fileExt }: ExportFileInput): Promise<Buffer> {
    const where: FindOptionsWhere<<%= classify(name) %>Entity> = ids && ids.length > 0 ? { id: In(ids) } : {};

    const data: <%= classify(name) %>Entity[] = await this.repository.find({ where, take: 10 });

    return convertJsonToFile(
      data.map((entity: <%= classify(name) %>Entity) => plainToClass(<%= classify(name) %>CreateInput, entity)),
      fileExt,
    );
  }
}
