export function mapField<T, K extends keyof T>(items: T[], field: K): Array<T[K]> {
  return items.map((item: T) => item[field]);
}
