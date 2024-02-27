import dot from 'dot-object';
import * as XLSX from 'xlsx';

export function convertExcelToJson<T>(buffer: Buffer): T[] {
  const workbook: XLSX.WorkBook = XLSX.read(buffer);
  const sheet_name_list: string[] = workbook.SheetNames;
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]).map((row: any) => dot.object(row) as unknown as T);
}
