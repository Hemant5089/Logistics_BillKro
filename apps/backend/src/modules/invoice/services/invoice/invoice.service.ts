import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../../common/prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getInvoiceSummary(
    sellerId: string,
    billingMonth: string,
  ) {
    // Verify Seller
    const seller =
      await this.prisma.seller.findUnique({
        where: {
          id: sellerId,
        },
      });

    if (!seller) {
      throw new NotFoundException(
        'Seller not found',
      );
    }

    // Load Billing Records
    const billingRecords =
      await this.prisma.billingRecord.findMany({
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

    if (billingRecords.length === 0) {
      return {
        success: true,
        message: 'No invoice found.',
      };
    }

    const shipmentCount =
      billingRecords.length;

    const forwardTotal =
      billingRecords.reduce(
        (sum, row) =>
          sum + row.forwardTotalCharge,
        0,
      );

    const codTotal =
      billingRecords.reduce(
        (sum, row) =>
          sum + row.codCharge,
        0,
      );

    const rtoTotal =
      billingRecords.reduce(
        (sum, row) =>
          sum + row.rtoCharge,
        0,
      );

    const grandTotal =
      billingRecords.reduce(
        (sum, row) =>
          sum + row.totalCharge,
        0,
      );

    return {
      success: true,

      seller: seller.sellerName,

      billingMonth,

      shipmentCount,

      forwardTotal,

      codTotal,

      rtoTotal,

      grandTotal,

      records: billingRecords,
    };
  }
}