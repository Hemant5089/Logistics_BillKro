import { ImportError } from './import-error.interface';

export interface ImportResult<T> {
  success: boolean;

  totalRows: number;

  validRows: number;

  invalidRows: number;

  data: T[];

  errors: ImportError[];
}