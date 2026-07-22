import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

import { ShipmentRow } from '../interface/shipment-row.interface';

@Injectable()
export class ShipmentImportService {
  parseExcel(buffer: Buffer): ShipmentRow[] {
    const workbook = XLSX.read(buffer, {
      type: 'buffer',
    });

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const rows: any[][] = XLSX.utils.sheet_to_json(
      worksheet,
      {
        header: 1,
        defval: '',
        raw: false,
      },
    );

    const result: ShipmentRow[] = [];

    // Skip Header Row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

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

      result.push({
        orderId: String(row[0]).trim(),

        awbNumber: String(row[1]).trim(),

        shipmentDate: String(row[2]).trim(),

        customerName: String(row[3]).trim(),

        senderName: String(row[4]).trim(),

        senderCity: String(row[5]).trim(),

        senderState: String(row[6]).trim(),

        senderPincode: String(row[7]).trim(),

        receiverName: String(row[8]).trim(),

        receiverCity: String(row[9]).trim(),

        receiverState: String(row[10]).trim(),

        receiverPincode: String(row[11]).trim(),

        actualWeight: Number(row[12]),

        length: Number(row[13]),

        breadth: Number(row[14]),

        height: Number(row[15]),

        volumetricWeight: Number(row[16]),

        carrier: String(row[17]).trim(),

        paymentMode: String(row[18])
          .trim()
          .toUpperCase(),

        shipmentStatus: String(row[19])
          .trim(),

        productValue: Number(row[20]),

        codAmount: Number(row[21]),
      });
    }

    return result;
  }
}