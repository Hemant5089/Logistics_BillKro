import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';

@Injectable()
export class InvoiceExcelService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async downloadExcel(
    sellerId: string,
    billingMonth: string,
    res: Response,
  ) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    const records = await this.prisma.billingRecord.findMany({
      where: {
        sellerId,
        billingMonth,
      },
      include: {
        shipment: true,
        carrier: true,
        zone: true,
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoice');

    worksheet.columns = [
      { header: 'AWB', key: 'awb', width: 22 },
      { header: 'Order ID', key: 'order', width: 22 },
      { header: 'Carrier', key: 'carrier', width: 18 },
      { header: 'Zone', key: 'zone', width: 15 },
      { header: 'Applicable Weight', key: 'weight', width: 20 },
      { header: 'Forward', key: 'forward', width: 15 },
      { header: 'COD', key: 'cod', width: 15 },
      { header: 'RTO', key: 'rto', width: 15 },
      { header: 'Total', key: 'total', width: 15 },
    ];

    for (const row of records) {
      worksheet.addRow({
        awb: row.shipment.awbNumber,
        order: row.shipment.orderId,
        carrier: row.carrier.name,
        zone: row.zone.name,
        weight: row.applicableWeight,
        forward: row.forwardTotalCharge,
        cod: row.codCharge,
        rto: row.rtoCharge,
        total: row.totalCharge,
      });
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Invoice_${seller.sellerName}_${billingMonth}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}