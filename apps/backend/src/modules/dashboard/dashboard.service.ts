import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getStats() {
    const [
      totalSellers,
      totalCarriers,
      totalShipments,
      totalBilling,
    ] = await Promise.all([
      this.prisma.seller.count(),

      this.prisma.carrier.count(),

      this.prisma.shipment.count(),

      this.prisma.billingRecord.aggregate({
        _sum: {
          totalCharge: true,
        },
      }),
    ]);

    return {
      totalSellers,

      totalCarriers,

      totalShipments,

      totalBilling:
        totalBilling._sum.totalCharge ?? 0,
    };
  }
}