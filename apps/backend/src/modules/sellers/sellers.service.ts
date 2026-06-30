import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SellersService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(data: {
    sellerName: string;
    companyName: string;
    email?: string;
    phone?: string;
    gstNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create Seller
      const seller = await tx.seller.create({
        data,
      });

      // 2. Get all Master Rate Cards
      const templates =
        await tx.rateCardTemplate.findMany();

      // 3. Clone Rate Cards
      if (templates.length > 0) {
        await tx.sellerRateCard.createMany({
          data: templates.map((template) => ({
            sellerId: seller.id,

            masterRateCardId: template.id,

            carrierId: template.carrierId,

            service: template.service,

            startWeight: template.startWeight,
            endWeight: template.endWeight,

            maxWeight: template.maxWeight,
            additionalWeight:
              template.additionalWeight,

            localAmount: template.localAmount,
            localAdditionalAmount:
              template.localAdditionalAmount,

            stateAmount: template.stateAmount,
            stateAdditionalAmount:
              template.stateAdditionalAmount,

            roiAmount: template.roiAmount,
            roiAdditionalAmount:
              template.roiAdditionalAmount,

            metroAmount: template.metroAmount,
            metroAdditionalAmount:
              template.metroAdditionalAmount,

            specialAmount:
              template.specialAmount,
            specialAdditionalAmount:
              template.specialAdditionalAmount,

            isActive: true,
          })),
        });
      }

      return seller;
    });
  }

  async findAll() {
    return this.prisma.seller.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

//   async getSellerRateCards(sellerId: string) {
//   return this.prisma.sellerRateCard.findMany({
//     where: {
//       sellerId,
//     },
//     include: {
//      carrier: {
//        select: {
//             id: true,
//             name: true,
//         },
//       },
//     },
//     orderBy: [
//       {
//         carrier: {
//           name: 'asc',
//         },
//       },
//       {
//         startWeight: 'asc',
//       },
//     ],
//   });
// }
}