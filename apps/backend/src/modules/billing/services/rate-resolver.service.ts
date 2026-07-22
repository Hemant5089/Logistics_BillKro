import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class RateResolverService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getSellerRateCards(
    sellerId: string,
  ) {
    return this.prisma.sellerRateCard.findMany({
      where: {
        sellerId,
        isActive: true,
      },
      include: {
        carrier: true,
      },
      orderBy: [
        {
          carrier: {
            name: 'asc',
          },
        },
        {
          startWeight: 'asc',
        },
      ],
    });
  }

  findRate(
    rateCards: any[],
    carrierId: string,
    service: string,
    applicableWeight: number,
  ) {
    const rate = rateCards.find((card) => {
      return (
        card.carrierId === carrierId &&
        card.service === service &&
        applicableWeight >= card.startWeight &&
        applicableWeight <= card.maxWeight
      );
    });

    if (!rate) {
      throw new NotFoundException(
        'Rate slab not found',
      );
    }

    return rate;
  }
}