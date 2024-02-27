import { TABLES_WITH_EXPIRING } from '../configs/tables-with-expiring.const';

export function CollectExpiringColumn<T>(): PropertyDecorator {
  return function (target: T, propertyName: string): void {
    TABLES_WITH_EXPIRING.add({ entityName: target.constructor.name, originalField: propertyName });
  };
}
