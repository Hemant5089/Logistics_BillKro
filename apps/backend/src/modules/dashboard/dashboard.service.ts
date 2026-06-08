import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getStats() {
    const totalSellers = await this.prisma.seller.count();

    const totalCarriers = await this.prisma.carrier.count();

    const totalZones = await this.prisma.zone.count();

    return {
      totalSellers,
      totalCarriers,
      totalZones,
    };
  }
}