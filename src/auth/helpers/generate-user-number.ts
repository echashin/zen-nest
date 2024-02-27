export function generateUserNumber(prefix: string, decimalNumber: number): string {
  return `${prefix}${decimalNumber.toString(36).toUpperCase()}`;
}
