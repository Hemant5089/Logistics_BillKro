import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getSummary() {
    const totalBills =
      await this.prisma.billingRecord.count();

    const revenue =
      await this.prisma.billingRecord.aggregate({
        _sum: {
          totalCharge: true,
        },
      });

    return {
      success: true,

      summary: {
        totalBills,

        totalRevenue:
          revenue._sum.totalCharge ?? 0,
      },
    };
  }

  async getBillingReport(
    sellerId?: string,
    billingMonth?: string,
  ) {
    const reports =
      await this.prisma.billingRecord.findMany({
        where: {
          ...(sellerId && {
            sellerId,
          }),

          ...(billingMonth && {
            billingMonth,
          }),
        },

        include: {
          shipment: true,
          seller: true,
          carrier: true,
          zone: true,
        },

        orderBy: {
          createdAt: 'desc',
        },
      });

    const totalRevenue = reports.reduce(
      (sum, item) => sum + item.totalCharge,
      0,
    );

    return {
      success: true,

      totalBills: reports.length,

      totalRevenue,

      reports,
    };
  }
}