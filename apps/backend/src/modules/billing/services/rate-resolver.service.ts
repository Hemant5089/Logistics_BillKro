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
  const matchingRates = rateCards
    .filter((card) => {
      return (
        card.carrierId === carrierId &&
        card.service === service &&
        applicableWeight <= Number(card.maxWeight)
      );
    })
    .sort((a, b) => {
      return (
        Number(a.maxWeight) -
        Number(b.maxWeight)
      );
    });

  const rate = matchingRates[0];

  if (!rate) {
    throw new NotFoundException(
      `Rate slab not found for ${applicableWeight}kg`,
    );
  }

  return {
    rate,
    billedWeight: applicableWeight,
  };
}
}
