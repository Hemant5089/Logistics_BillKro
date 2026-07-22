import { Injectable } from '@nestjs/common';
import { ShipmentRow } from '../interface/shipment-row.interface';
import { ImportResult } from '../../shipments/interface/import-result.interface';
import { ImportError } from '../interface/import-error.interface';

@Injectable()
export class ShipmentValidationService {

  validate(
    rows: ShipmentRow[],
  ): ImportResult<ShipmentRow> {

    const validRows: ShipmentRow[] = [];

    const errors: ImportError[] = [];
    const awbSet = new Set<string>();

    rows.forEach((row, index) => {

      if (!row.awbNumber) {
        errors.push({
          rowNumber: index + 2,
          reason: 'AWB Number is required',
        });

        return;
      }

      if (awbSet.has(row.awbNumber)) {
        errors.push({
          rowNumber: index + 2,
          awbNumber: row.awbNumber,
          reason: 'Duplicate AWB in uploaded file',
        });

        return;
      }

      awbSet.add(row.awbNumber);

      if (!row.carrier) {
        errors.push({
          rowNumber: index + 2,
          awbNumber: row.awbNumber,
          reason: 'Carrier is required',
        });

        return;
      }

      if (!row.senderCity) {
        errors.push({
          rowNumber: index + 2,
          awbNumber: row.awbNumber,
          reason: 'Sender City is required',
        });

        return;
      }

      if (!row.receiverCity) {
        errors.push({
          rowNumber: index + 2,
          awbNumber: row.awbNumber,
          reason: 'Receiver City is required',
        });

        return;
      }

      if (
        isNaN(row.actualWeight) ||
        row.actualWeight <= 0
      ) {
        errors.push({
          rowNumber: index + 2,
          awbNumber: row.awbNumber,
          reason: 'Invalid Weight',
        });

        return;
      }

      validRows.push(row);
    });

    return {
      success: errors.length === 0,

      totalRows: rows.length,

      validRows: validRows.length,

      invalidRows: errors.length,

      data: validRows,

      errors,
    };
  }
}