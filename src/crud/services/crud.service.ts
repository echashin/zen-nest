import { BadRequestException, InternalServerErrorException, NotFoundException, ValidationError } from '@nestjs/common';
import { ClassConstructor, plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Brackets, DeepPartial, DeleteResult, ObjectLiteral, Repository, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';
import { OrderByCondition } from 'typeorm/find-options/OrderByCondition';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { ImportDto, ImportErrorDto, Pageable } from '../dto';
import { emptyCrudRequest } from '../empty-crud-request';
import { mapErrors } from '../helpers/exception-factory';
import { CrudRequest, GetManyDefaultResponse, JoinOption, JoinOptions, ParsedRequestParams } from '../interfaces';
import { ComparisonOperator, QueryFilter, QueryJoin, QuerySort, SCondition, SConditionKey } from '../types';
import { isArrayFull, isEqual, isNil, isNull, isObject } from '../utils';
import { UniqueInArray } from '../validators/unique-in-array';

export class CrudService<T extends { id?: string }> {
  private entityColumns: string[];
  private entityPrimaryColumns: string[];
  private entityColumnsHash: ObjectLiteral = {};
  private entityRelationsHash: ObjectLiteral = {};
  private select: string[];

  private relations: JoinOptions = {};

  constructor(protected readonly repository: Repository<T>, relations: JoinOptions = {}) {
    this.relations = relations;
    this.onInitMapEntityColumns();
    this.onInitMapRelations();
  }

  /**
   * Get many
   * @param req
   */
  private async getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]> {
    const { parsed } = req;
    const builder: SelectQueryBuilder<T> = await this.createBuilder(parsed);
    return this.doGetMany(builder);
  }

  /**
   * Delete
   * @param {string|string[]} ids
   * @return {number} number of deleted records
   */
  public async delete(ids: string | string[]): Promise<number> {
    const resp: DeleteResult = await this.repository.delete(ids);
    if (!Array.isArray(ids) && resp.affected !== 1) {
      throw new NotFoundException(`Item not found id:${ids}`);
    }
    return resp.affected;
  }

  /**
   * Recover
   * @param {string} id
   *
   */
  public async recover(id: string): Promise<T> {
    return await this.repository.recover({ id } as DeepPartial<T>);
  }

  /**
   * Soft Delete
   * @param {string|string[]} ids
   * @return {number} number of deleted records
   */
  public async softDelete(ids: string | string[]): Promise<number> {
    const resp: DeleteResult = await this.repository.softDelete(ids);
    if (!Array.isArray(ids) && resp.affected !== 1) {
      throw new NotFoundException(`Item not found id:${ids}`);
    }
    return resp.affected;
  }

  /**
   * Create
   * @param input
   * @return {number} number of deleted records
   */
  public async create(input: DeepPartial<T>): Promise<T> {
    return this.repository.save(this.repository.create(input));
  }

  /**
   * Update
   * @param {string} id
   * @param {DeepPartial<T>} input
   * @return {number} number of deleted records
   */
  public async update(id: string, input: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, input as QueryDeepPartialEntity<T>);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await this.repository.findOne({ where: { id } });
  }

  private get entityType(): ClassConstructor<T> {
    return this.repository.target as ClassConstructor<T>;
  }

  private get alias(): string {
    return this.repository.metadata.targetName;
  }

  /**
   * Create TypeOrm QueryBuilder
   * @param parsed
   * @param options
   *
   * @param many
   */
  // eslint-disable-next-line complexity
  private async createBuilder(parsed: ParsedRequestParams, many: boolean = true): Promise<SelectQueryBuilder<T>> {
    // create query builder
    const builder: SelectQueryBuilder<T> = this.repository.createQueryBuilder(this.alias);
    // get select fields
    this.select = this.getSelect(parsed);
    // select fields

    // search
    this.setSearchCondition(builder, parsed.search);

    if (isArrayFull(parsed.join)) {
      for (let i: number = 0; i < parsed.join.length; i++) {
        this.setJoin(parsed.join[i], builder);
      }
    }

    /* istanbul ignore else */
    if (many) {
      // set sort (order by)
      const sort: OrderByCondition = this.getSort(parsed);
      builder.orderBy(sort);

      // set take
      const take: number = parsed.limit;

      /* istanbul ignore else */
      if (Number.isFinite(take)) {
        //builder.take(take);
        builder.limit(take);
      }

      // set skip
      const skip: number = this.getSkip(parsed, take);

      /* istanbul ignore else */
      if (Number.isFinite(skip)) {
        //builder.skip(skip);
        builder.offset(skip);
      }
    }

    // set cache
    if (parsed.cache !== 0) {
      builder.cache(builder.getQueryAndParameters(), parsed.cache);
    }
    builder.select([...new Set(this.select)]);

    return builder;
  }

  /**
   * depends on paging call `SelectQueryBuilder#getMany` or `SelectQueryBuilder#getManyAndCount`
   * helpful for overriding `TypeOrmCrudService#getMany`
   * @see getMany
   * @see SelectQueryBuilder#getMany
   * @see SelectQueryBuilder#getManyAndCount
   * @param builder
   */
  private async doGetMany(builder: SelectQueryBuilder<T>): Promise<GetManyDefaultResponse<T> | T[]> {
    const [data, total] = await builder.getManyAndCount();

    const limit: number = builder.expressionMap.limit;
    const offset: number = builder.expressionMap.offset;

    return this.createPageInfo(data, total, limit || total, offset || 0);
  }

  private onInitMapEntityColumns(): void {
    this.entityColumns = this.repository.metadata.columns.map((prop: ColumnMetadata) => {
      // In case column is an embedded, use the propertyPath to get complete path
      if (prop.embeddedMetadata) {
        this.entityColumnsHash[prop.propertyPath] = true;
        return prop.propertyPath;
      }
      this.entityColumnsHash[prop.propertyName] = true;
      return prop.propertyName;
    });
    this.entityPrimaryColumns = this.repository.metadata.columns
      .filter((prop: ColumnMetadata) => prop.isPrimary)
      .map((prop: ColumnMetadata) => prop.propertyName);
  }

  private onInitMapRelations(): void {
    this.entityRelationsHash = Object.fromEntries(
      this.repository.metadata.relations.map((curr: RelationMetadata) => [
        curr.propertyName,
        {
          name: curr.propertyName,
          columns: curr.inverseEntityMetadata.columns.map((col: ColumnMetadata) => col.propertyName),
          primaryColumns: curr.inverseEntityMetadata.primaryColumns.map((col: ColumnMetadata) => col.propertyName),
        },
      ]),
    );
  }

  private async getOneOrFail(req: CrudRequest): Promise<T> {
    const { parsed } = req;
    const builder: SelectQueryBuilder<T> = await this.createBuilder(parsed, false);
    this.setSearchCondition(builder, parsed.search);

    const found: T = await builder.getOne();

    if (!found) {
      this.throwNotFoundException(this.alias);
    }

    return found;
  }

  private getRelationMetadata(field: string): RelationMetadata & { nestedRelation?: string } {
    try {
      const fields: string[] = field.split('.');
      const target: string = fields.at(-1);
      const paths: string[] = fields.slice(0, -1);

      let relations: RelationMetadata[] = this.repository.metadata.relations;

      for (const propertyName of paths) {
        relations = relations.find((o: RelationMetadata) => o.propertyName === propertyName).inverseEntityMetadata.relations;
      }

      const relation: RelationMetadata & { nestedRelation?: string } = relations.find((o: RelationMetadata) => o.propertyName === target);

      relation.nestedRelation = `${fields.at(-2)}.${target}`;

      return relation;
    } catch {
      return null;
    }
  }

  // eslint-disable-next-line complexity
  private setJoin(
    cond: QueryJoin,
    //joinOptions: JoinOptions,
    builder: SelectQueryBuilder<T>,
  ): boolean {
    if (this.entityRelationsHash[cond.field] === undefined && cond.field.includes('.')) {
      const curr: RelationMetadata & { nestedRelation?: string } = this.getRelationMetadata(cond.field);
      if (!curr) {
        this.entityRelationsHash[cond.field] = null;
        return true;
      }

      this.entityRelationsHash[cond.field] = {
        name: curr.propertyName,
        columns: curr.inverseEntityMetadata.columns.map((col: ColumnMetadata) => col.propertyName),
        primaryColumns: curr.inverseEntityMetadata.primaryColumns.map((col: ColumnMetadata) => col.propertyName),
        nestedRelation: curr.nestedRelation,
      };
    }

    if (
      cond.field &&
      this.entityRelationsHash[cond.field]
      //&& joinOptions[cond.field]
    ) {
      const relation: ObjectLiteral = this.entityRelationsHash[cond.field];
      const joinOptions: JoinOption = this.relations[cond.field];
      const allowed: string[] = relation.columns;

      if (allowed.length === 0) {
        return true;
      }

      const alias: string = joinOptions.alias || relation.name;

      const columns: string[] = !cond.select || cond.select.length === 0 ? allowed : cond.select.filter((col: string) => allowed.includes(col));

      const select: string[] = [
        ...relation.primaryColumns,
        ...(joinOptions.persist && joinOptions.persist.length > 0 ? joinOptions.persist : []),
        ...columns,
      ].map((col: string) => `${alias}.${col}`);

      const relationPath: string = relation.nestedRelation || `${this.alias}.${relation.name}`;

      const relationType: string = joinOptions.required ? 'innerJoin' : 'leftJoin';

      builder[relationType](relationPath, alias);
      this.select = [...this.select, ...select];
    }

    return true;
  }

  private setAndWhere(cond: QueryFilter, i: any, builder: SelectQueryBuilder<T> | WhereExpressionBuilder): void {
    const { str, params } = this.mapOperatorsToQuery(cond, `andWhere${i.replaceAll('#', '_')}`);
    builder.andWhere(str, params);
  }

  private setOrWhere(cond: QueryFilter, i: any, builder: SelectQueryBuilder<T> | WhereExpressionBuilder): void {
    const { str, params } = this.mapOperatorsToQuery(cond, `orWhere${i.replaceAll('#', '_')}`);
    builder.orWhere(str, params);
  }

  private setSearchCondition(builder: SelectQueryBuilder<T>, search: SCondition, condition: SConditionKey = '$and'): void {
    /* istanbul ignore else */
    if (isObject(search)) {
      const keys: string[] = Object.keys(search);
      /* istanbul ignore else */
      if (keys.length > 0) {
        // search: {$and: [...], ...}
        if (isArrayFull(search.$and)) {
          // search: {$and: [{}]}
          if (search.$and.length === 1) {
            this.setSearchCondition(builder, search.$and[0], condition);
          }
          // search: {$and: [{}, {}, ...]}
          else {
            this.builderAddBrackets(
              builder,
              condition,
              new Brackets((qb: any) => {
                for (const item of search.$and) {
                  this.setSearchCondition(qb, item, '$and');
                }
              }),
            );
          }
        }
        // search: {$or: [...], ...}
        else if (isArrayFull(search.$or)) {
          // search: {$or: [...]}
          if (keys.length === 1) {
            // search: {$or: [{}]}
            if (search.$or.length === 1) {
              this.setSearchCondition(builder, search.$or[0], condition);
            }
            // search: {$or: [{}, {}, ...]}
            else {
              this.builderAddBrackets(
                builder,
                condition,
                new Brackets((qb: any) => {
                  for (const item of search.$or) {
                    this.setSearchCondition(qb, item, '$or');
                  }
                }),
              );
            }
          }
          // search: {$or: [...], foo, ...}
          else {
            this.builderAddBrackets(
              builder,
              condition,
              new Brackets((qb: any) => {
                for (const field of keys) {
                  if (field === '$or') {
                    if (search.$or.length === 1) {
                      this.setSearchCondition(
                        builder,

                        search.$or[0],
                        '$and',
                      );
                    } else {
                      this.builderAddBrackets(
                        qb,
                        '$and',
                        new Brackets((qb2: any) => {
                          for (const item of search.$or) {
                            this.setSearchCondition(qb2, item, '$or');
                          }
                        }),
                      );
                    }
                  } else {
                    const value: any = search[field];
                    if (isObject(value)) {
                      this.setSearchFieldObjectCondition(qb, '$and', field, value);
                    } else {
                      this.builderSetWhere(qb, '$and', field, value);
                    }
                  }
                }
              }),
            );
          }
        }
        // search: {...}
        else {
          // search: {foo}
          if (keys.length === 1) {
            const field: string = keys[0];
            const value: any = search[field];
            if (isObject(value)) {
              this.setSearchFieldObjectCondition(builder, condition, field, value);
            } else {
              this.builderSetWhere(builder, condition, field, value);
            }
          }
          // search: {foo, ...}
          else {
            this.builderAddBrackets(
              builder,
              condition,
              new Brackets((qb: any) => {
                for (const field of keys) {
                  const value: any = search[field];
                  if (isObject(value)) {
                    this.setSearchFieldObjectCondition(qb, '$and', field, value);
                  } else {
                    this.builderSetWhere(qb, '$and', field, value);
                  }
                }
              }),
            );
          }
        }
      }
    }
  }

  private builderAddBrackets(builder: SelectQueryBuilder<T>, condition: SConditionKey, brackets: Brackets): void {
    if (condition === '$and') {
      builder.andWhere(brackets);
    } else {
      builder.orWhere(brackets);
    }
  }

  private builderSetWhere(
    builder: SelectQueryBuilder<T>,
    condition: SConditionKey,
    field: string,
    value: any,
    operator: ComparisonOperator = '$eq',
  ): void {
    const time: [number, number] = process.hrtime();
    const index: string = `${field}${time[0]}${time[1]}`;
    // eslint-disable-next-line @typescript-eslint/typedef
    const args = [{ field, operator: isNull(value) ? '$isnull' : operator, value }, index, builder];
    // eslint-disable-next-line @typescript-eslint/typedef
    const fn = condition === '$and' ? this.setAndWhere : this.setOrWhere;
    fn.apply(this, args);
  }

  private setSearchFieldObjectCondition(builder: SelectQueryBuilder<T>, condition: SConditionKey, field: string, object: any): void {
    if (isObject(object)) {
      const operators: string[] = Object.keys(object);

      if (operators.length === 1) {
        // eslint-disable-next-line @typescript-eslint/typedef
        const operator = operators[0] as ComparisonOperator;
        const value: any = object[operator];

        if (isObject(object.$or)) {
          const orKeys: string[] = Object.keys(object.$or);
          this.setSearchFieldObjectCondition(builder, orKeys.length === 1 ? condition : '$or', field, object.$or);
        } else {
          this.builderSetWhere(builder, condition, field, value, operator);
        }
      } else {
        /* istanbul ignore else */
        if (operators.length > 1) {
          this.builderAddBrackets(
            builder,
            condition,
            new Brackets((qb: any) => {
              for (const operator of operators) {
                const value: any = object[operator];

                if (operator === '$or') {
                  const orKeys: string[] = Object.keys(object.$or);

                  if (orKeys.length === 1) {
                    this.setSearchFieldObjectCondition(
                      qb,

                      condition,
                      field,
                      object.$or,
                    );
                  } else {
                    this.builderAddBrackets(
                      qb,
                      condition,
                      new Brackets((qb2: any) => {
                        this.setSearchFieldObjectCondition(
                          qb2,

                          '$or',
                          field,
                          object.$or,
                        );
                      }),
                    );
                  }
                } else {
                  this.builderSetWhere(qb, condition, field, value, operator as ComparisonOperator);
                }
              }
            }),
          );
        }
      }
    }
  }

  private prepareColumn(name: string, addQuotes: boolean): string {
    const parts: string[] = name.split('#');
    return parts.length === 1 ? this.quotes(name, addQuotes) : `${this.quotes(parts[0], addQuotes)} #>>'{${parts.slice(1).join(',')}}'`;
  }

  private quotes(text: string, addQuotes: boolean): string {
    const res: string = text.replaceAll('"', '');
    return addQuotes ? `"${res}"` : res;
  }

  private getSelect(query: ParsedRequestParams): string[] {
    const allowed: string[] = this.entityColumns;

    const columns: string[] = query.fields && query.fields.length > 0 ? query.fields.filter((field: string) => allowed.includes(field)) : allowed;

    const select: string[] = [...columns, ...this.entityPrimaryColumns].map((col: string) => {
      return `${this.alias}.${col}`;
    });
    return [...new Set(select)];
  }

  private getSort(query: ParsedRequestParams): ObjectLiteral {
    if (query.sort && query.sort.length > 0) {
      return this.mapSort(query.sort);
    }
  }

  private getFieldWithAlias(rawField: string, addQuotes: boolean): string {
    const field: string = rawField;
    const cols: string[] = field.split('.');
    let result: string;
    // relation is alias
    switch (cols.length) {
      case 1: {
        result = `"${this.alias}".${this.prepareColumn(field, addQuotes)}`;
        break;
      }
      case 2: {
        result = `"${cols[0]}".${this.prepareColumn(cols[1], addQuotes)}`;
        break;
      }
      default: {
        const cols2: string[] = cols.slice(-2, cols.length);
        result = `"${cols2[0]}".${this.prepareColumn(cols2[1], addQuotes)}`;
        break;
      }
    }
    return result;
  }

  private getFieldWithAliasForSorting(rawField: string, order: string): ObjectLiteral {
    const field: string = rawField;
    const cols: string[] = field.split('.');
    const result: ObjectLiteral = {};

    // relation is alias
    switch (cols.length) {
      case 1: {
        const alias: string = `${this.alias}`;
        const f: string = this.prepareColumn(field, false);
        result[[alias, f].join('.')] = order;
        this.select = [...this.select, [alias, f].join('.')];
        break;
      }
      case 2: {
        const alias: string = `${cols[0]}`;
        const f: string = this.prepareColumn(cols[1], false);
        result[[alias, f].join('.')] = order;
        this.select = [...this.select, [alias, f].join('.')];
        break;
      }
      default: {
        const cols2: string[] = cols.slice(-2, cols.length);
        const alias: string = `${cols2[0]}`;
        const f: string = this.prepareColumn(cols2[1], false);
        result[[alias, f].join('.')] = order;
        this.select = [...this.select, [alias, f].join('.')];
        break;
      }
    }
    return result;
  }

  private mapSort(sort: QuerySort[]): ObjectLiteral {
    let params: ObjectLiteral = {};
    for (const element of sort) {
      params = { ...params, ...this.getFieldWithAliasForSorting(element.field, element.order) };
    }

    return params;
  }

  // eslint-disable-next-line complexity
  private mapOperatorsToQuery(
    cond: QueryFilter,
    param: any,
  ): {
    str: string;
    params: ObjectLiteral;
  } {
    const field: string = this.getFieldWithAlias(cond.field, true);

    const likeOperator: string = 'ILIKE';
    let str: string;
    let params: ObjectLiteral;

    if (cond.operator[0] !== '$') {
      cond.operator = `$${cond.operator}` as ComparisonOperator;
    }

    switch (cond.operator) {
      case '$eq': {
        str = `${field} = :${param}`;
        break;
      }

      case '$ne': {
        str = `${field} != :${param}`;
        break;
      }

      case '$gt': {
        str = `${field} > :${param}`;
        break;
      }

      case '$lt': {
        str = `${field} < :${param}`;
        break;
      }

      case '$gte': {
        str = `${field} >= :${param}`;
        break;
      }

      case '$lte': {
        str = `${field} <= :${param}`;
        break;
      }

      case '$starts': {
        str = `${field} LIKE :${param}`;
        params = { [param]: `${cond.value}%` };
        break;
      }

      case '$ends': {
        str = `${field} LIKE :${param}`;
        params = { [param]: `%${cond.value}` };
        break;
      }

      case '$cont': {
        str = `${field} LIKE :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;
      }

      case '$excl': {
        str = `${field} NOT LIKE :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;
      }

      case '$in': {
        this.checkFilterIsArray(cond);
        str = `${field} IN (:...${param})`;
        break;
      }

      case '$notin': {
        this.checkFilterIsArray(cond);
        str = `${field} NOT IN (:...${param})`;
        break;
      }

      case '$isnull': {
        str = `${field} IS NULL`;
        params = {};
        break;
      }

      case '$notnull': {
        str = `${field} IS NOT NULL`;
        params = {};
        break;
      }

      case '$between': {
        this.checkFilterIsArray(cond, cond.value.length !== 2);
        str = `${field} BETWEEN :${param}0 AND :${param}1`;
        params = {
          [`${param}0`]: cond.value[0],
          [`${param}1`]: cond.value[1],
        };
        break;
      }

      // case insensitive
      case '$eqL': {
        str = `LOWER(${field}) = :${param}`;
        break;
      }

      case '$neL': {
        str = `LOWER(${field}) != :${param}`;
        break;
      }

      case '$startsL': {
        str = `${field} ${likeOperator} :${param}`;
        params = { [param]: `${cond.value}%` };
        break;
      }

      case '$endsL': {
        str = `${field} ${likeOperator} :${param}`;
        params = { [param]: `%${cond.value}` };
        break;
      }

      case '$contL': {
        str = `${field} ${likeOperator} :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;
      }

      case '$exclL': {
        str = `${field} NOT ${likeOperator} :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;
      }

      case '$inL': {
        this.checkFilterIsArray(cond);
        str = `LOWER(${field}) IN (:...${param})`;
        break;
      }

      case '$notinL': {
        this.checkFilterIsArray(cond);
        str = `LOWER(${field}) NOT IN (:...${param})`;
        break;
      }

      /* istanbul ignore next */
      default: {
        str = `${field} = :${param}`;
        break;
      }
    }

    if (params === undefined) {
      params = { [param]: cond.value };
    }

    return { str, params };
  }

  private checkFilterIsArray(cond: QueryFilter, withLength?: boolean): void {
    if (!Array.isArray(cond.value) || cond.value.length === 0 || (isNil(withLength) ? false : withLength)) {
      this.throwBadRequestException(`Invalid column '${cond.field}' value`);
    }
  }

  async import<I extends object>(inputCls: ClassConstructor<I>, data: I[]): Promise<ImportDto> {
    const inputs: I[] = plainToInstance(inputCls, data, {
      enableImplicitConversion: true,
    });
    const inputObjectClass: I = plainToClass(inputCls, {});
    const errors: ImportErrorDto[] = [];
    const keys: string[] = Object.keys(inputObjectClass);
    let errorCount: number = 0;
    const uniqueFields: string[] = keys.filter((key: string) => Reflect.getMetadata('validator:unique', inputObjectClass, key));
    const uniqueErrors: ValidationError[] = UniqueInArray(inputs, uniqueFields);
    errorCount = uniqueErrors.length;
    for (const err of uniqueErrors) {
      errors.push({
        target: err.target,
        errors: mapErrors([err]),
      });
    }
    for (const input of inputs) {
      const validationErrors: ValidationError[] = await validate(input, {
        skipMissingProperties: true,
        whitelist: true,
      });
      if (validationErrors.length > 0) {
        errorCount++;
        const existingError: number = errors.findIndex(({ target }: ImportErrorDto) => isEqual(target, input));
        if (existingError < 0) {
          errors.push({
            target: input,
            errors: mapErrors(validationErrors),
          });
        } else {
          errors[existingError] = {
            target: input,
            errors: [...errors[existingError].errors, ...mapErrors(validationErrors)],
          };
        }
      }
    }
    if (errorCount > 0) {
      return {
        keys,
        errorCount,
        errors,
        isValid: false,
        successCount: 0,
        totalCount: inputs.length,
      };
    }

    await this.repository.save(this.repository.create(inputs as DeepPartial<T>), { chunk: 500, transaction: true });

    return {
      keys,
      errors: [],
      isValid: true,
      successCount: inputs.length,
      errorCount: 0,
      totalCount: inputs.length,
    };
  }

  async crudGetOne(id: string, req: CrudRequest = emptyCrudRequest): Promise<T> {
    return this.getOneOrFail({
      parsed: {
        ...req.parsed,
        search: { id },
      },
    });
  }

  async crudGetMany(req: CrudRequest = emptyCrudRequest): Promise<Pageable<T>> {
    const { data, count, page, pageCount, total }: GetManyDefaultResponse<T> = (await this.getMany(req)) as GetManyDefaultResponse<T>;

    return {
      items: data,
      count,
      page: page || 0,
      pageCount: pageCount || 0,
      total,
    };
  }

  private throwBadRequestException(msg?: any): BadRequestException {
    throw new BadRequestException(msg);
  }

  private throwNotFoundException(name: string): NotFoundException {
    throw new NotFoundException(`${name} not found`);
  }

  private throwInternalServerException(name: string, operation: string): InternalServerErrorException {
    throw new NotFoundException(`Error performing ${operation} on ${name}.`);
  }

  /**
   * Wrap page into page-info
   * override this method to create custom page-info response
   * or set custom `serialize.getMany` dto in the controller's CrudOption
   * @param data
   * @param total
   * @param limit
   * @param offset
   */
  private createPageInfo(data: T[], total: number, limit: number, offset: number): GetManyDefaultResponse<T> {
    return {
      data,
      count: data.length,
      total,
      page: Math.floor(offset / limit) + 1,
      pageCount: limit && total ? Math.ceil(total / limit) : undefined,
    };
  }

  /**
   * Get number of resources to be fetched
   * @param query
   * @param options
   */
  private getTake(query: ParsedRequestParams): number | null {
    if (query.limit) {
      return query.limit;
    }
  }

  /**
   * Get number of resources to be skipped
   * @param query
   * @param take
   */
  private;

  getSkip(query: ParsedRequestParams, take: number): number | null {
    return query.page && take ? take * (query.page - 1) : query.offset ?? null;
  }
}
