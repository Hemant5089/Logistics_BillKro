import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class RateCardsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(data: any) {
    return await this.prisma.rateCard.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.rateCard.findMany({
      include: {
        seller: true,
        carrier: true,
        zone: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.rateCard.findUnique({
      where: {
        id,
      },
      include: {
        seller: true,
        carrier: true,
        zone: true,
      },
    });
  }
}