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
}