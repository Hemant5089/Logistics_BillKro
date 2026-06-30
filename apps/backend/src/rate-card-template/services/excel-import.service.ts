import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

import { ExcelRow } from '../interfaces/excel-row.interface';

@Injectable()
export class ExcelImportService {
  parseExcel(buffer: Buffer): ExcelRow[] {
    const workbook = XLSX.read(buffer, {
      type: 'buffer',
    });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Read as array instead of object
    const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
      raw: false,
    });

    const result: ExcelRow[] = [];

    // Skip first row (header)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      // Skip blank rows
      if (
        !row ||
        row.every(
          (value) =>
            value === '' ||
            value === null ||
            value === undefined,
        )
      ) {
        continue;
      }

      // Skip separator rows
      if (!row[0] || !row[1]) {
        continue;
      }

      result.push({
        name: String(row[0]).trim(),

        carrier: String(row[1]).trim(),

        service: String(row[2])
          .trim()
          .toUpperCase(),

        startWeight: Number(row[3]),

        endWeight: Number(row[4]),

        maxWeight: Number(row[5]),

        additionalWeight: Number(row[6]),

        localAmount: Number(row[7]),

        localAdditionalAmount: Number(row[8]),

        stateAmount: Number(row[9]),

        stateAdditionalAmount: Number(row[10]),

        roiAmount: Number(row[11]),

        roiAdditionalAmount: Number(row[12]),

        metroAmount: Number(row[13]),

        metroAdditionalAmount: Number(row[14]),

        specialAmount: Number(row[15]),

        specialAdditionalAmount: Number(row[16]),
      });
    }

    return result;
  }
}