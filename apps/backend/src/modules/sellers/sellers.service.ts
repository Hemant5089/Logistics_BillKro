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
      const seller = await tx.seller.create({
        data,
      });

      const templates =
        await tx.rateCardTemplate.findMany();

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
            additionalWeight: template.additionalWeight,
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
            specialAmount: template.specialAmount,
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

  async findOne(id: string) {
    return this.prisma.seller.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.seller.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.seller.delete({
      where: {
        id,
      },
    });
  }
}