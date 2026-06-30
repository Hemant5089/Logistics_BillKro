import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateSellerRateCardDto } from './dto/update-seller-rate-card.dto';
import { CopyRateCardDto } from './dto/copy-rate-card.dto';
import { CopySellerRateCardDto } from './dto/copy-seller-rate-card.dto';
import { ExcelImportService } from '../../rate-card-template/services/excel-import.service';
import { ServiceType } from '@prisma/client';

@Injectable()
export class SellerRateCardsService {
  constructor(
    private prisma: PrismaService,
    private excelImportService: ExcelImportService,

  ) {}

  async getSellerRateCards(
    sellerId: string,
  ) {
    return this.prisma.sellerRateCard.findMany({
      where: {
        sellerId,
      },
      include: {
        carrier: {
          select: {
            id: true,
            name: true,
          },
        },
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

  async update(
    id: string,
    data: UpdateSellerRateCardDto,
  ) {
    const rateCard =
      await this.prisma.sellerRateCard.findUnique({
        where: {
          id,
        },
      });

    if (!rateCard) {
      throw new NotFoundException(
        'Seller rate card not found',
      );
    }

    return this.prisma.sellerRateCard.update({
      where: {
        id,
      },
      data,
      include: {
        carrier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async copyRateCard(dto: CopyRateCardDto) {
  // Check seller
  const seller = await this.prisma.seller.findUnique({
    where: {
      id: dto.sellerId,
    },
  });

  if (!seller) {
    throw new NotFoundException('Seller not found');
  }

  // Check carrier
  const carrier = await this.prisma.carrier.findUnique({
    where: {
      id: dto.carrierId,
    },
  });

  if (!carrier) {
    throw new NotFoundException('Carrier not found');
  }

  // Fetch master rate cards
  const masterRateCards =
    await this.prisma.rateCardTemplate.findMany({
      where: {
        carrierId: dto.carrierId,
      },
      orderBy: {
        startWeight: 'asc',
      },
    });

  if (masterRateCards.length === 0) {
    throw new BadRequestException(
      'No master rate card found for this carrier',
    );
  }

  // Delete existing seller rate cards
  await this.prisma.sellerRateCard.deleteMany({
    where: {
      sellerId: dto.sellerId,
      carrierId: dto.carrierId,
    },
  });

  // Copy all slabs
  await this.prisma.sellerRateCard.createMany({
    data: masterRateCards.map((rate) => ({
      sellerId: dto.sellerId,

      masterRateCardId: rate.id,

      name: rate.name,

      carrierId: rate.carrierId,

      service: rate.service,

      startWeight: rate.startWeight,

      endWeight: rate.endWeight,

      maxWeight: rate.maxWeight,

      additionalWeight: rate.additionalWeight,

      localAmount: rate.localAmount,

      localAdditionalAmount:
        rate.localAdditionalAmount,

      stateAmount: rate.stateAmount,

      stateAdditionalAmount:
        rate.stateAdditionalAmount,

      roiAmount: rate.roiAmount,

      roiAdditionalAmount:
        rate.roiAdditionalAmount,

      metroAmount: rate.metroAmount,

      metroAdditionalAmount:
        rate.metroAdditionalAmount,

      specialAmount: rate.specialAmount,

      specialAdditionalAmount:
        rate.specialAdditionalAmount,
    })),
  });

  return {
    success: true,
    seller: seller.sellerName,
    carrier: carrier.name,
    copied: masterRateCards.length,
  };
}

async copySellerRateCard(dto: CopySellerRateCardDto) {
  // Prevent copying to same seller
  if (dto.sourceSellerId === dto.targetSellerId) {
    throw new BadRequestException(
      'Source seller and target seller cannot be the same',
    );
  }

  // Check source seller
  const sourceSeller = await this.prisma.seller.findUnique({
    where: {
      id: dto.sourceSellerId,
    },
  });

  if (!sourceSeller) {
    throw new NotFoundException('Source seller not found');
  }

  // Check target seller
  const targetSeller = await this.prisma.seller.findUnique({
    where: {
      id: dto.targetSellerId,
    },
  });

  if (!targetSeller) {
    throw new NotFoundException('Target seller not found');
  }

  // Check carrier
  const carrier = await this.prisma.carrier.findUnique({
    where: {
      id: dto.carrierId,
    },
  });

  if (!carrier) {
    throw new NotFoundException('Carrier not found');
  }

  // Get source seller rate cards
  const sourceRates = await this.prisma.sellerRateCard.findMany({
    where: {
      sellerId: dto.sourceSellerId,
      carrierId: dto.carrierId,
    },
  });

  if (sourceRates.length === 0) {
    throw new BadRequestException(
      'Source seller has no rate cards for this carrier',
    );
  }

  // Delete target seller's existing rate cards
  await this.prisma.sellerRateCard.deleteMany({
    where: {
      sellerId: dto.targetSellerId,
      carrierId: dto.carrierId,
    },
  });

  // Copy all rows
  await this.prisma.sellerRateCard.createMany({
    data: sourceRates.map((rate) => ({
      sellerId: dto.targetSellerId,

      masterRateCardId: rate.masterRateCardId,

      name: rate.name,

      carrierId: rate.carrierId,

      service: rate.service,

      startWeight: rate.startWeight,

      endWeight: rate.endWeight,

      maxWeight: rate.maxWeight,

      additionalWeight: rate.additionalWeight,

      localAmount: rate.localAmount,

      localAdditionalAmount: rate.localAdditionalAmount,

      stateAmount: rate.stateAmount,

      stateAdditionalAmount: rate.stateAdditionalAmount,

      roiAmount: rate.roiAmount,

      roiAdditionalAmount: rate.roiAdditionalAmount,

      metroAmount: rate.metroAmount,

      metroAdditionalAmount: rate.metroAdditionalAmount,

      specialAmount: rate.specialAmount,

      specialAdditionalAmount: rate.specialAdditionalAmount,
    })),
  });

  return {
    success: true,
    sourceSeller: sourceSeller.sellerName,
    targetSeller: targetSeller.sellerName,
    carrier: carrier.name,
    copied: sourceRates.length,
  };
}

async importSellerRateCard(
  sellerId: string,
  buffer: Buffer,
) {
  const seller = await this.prisma.seller.findUnique({
    where: {
      id: sellerId,
    },
  });

  if (!seller) {
    throw new NotFoundException('Seller not found');
  }

  const rows =
    this.excelImportService.parseExcel(buffer);

  let imported = 0;
  let skipped = 0;

  const errors: any[] = [];

  const carriers =
    await this.prisma.carrier.findMany();

  const carrierMap = new Map(
    carriers.map((carrier) => [
      carrier.name.trim().toLowerCase(),
      carrier,
    ]),
  );

  const existingRates =
    await this.prisma.sellerRateCard.findMany({
      where: {
        sellerId,
      },
    });

  const existingMap = new Map(
    existingRates.map((rate) => [
      `${rate.carrierId}_${rate.service}_${rate.startWeight}_${rate.endWeight}`,
      rate,
    ]),
  );

  const operations: any[] = [];

  for (const row of rows) {
    try {
      const carrier = carrierMap.get(
        row.carrier.trim().toLowerCase(),
      );

      if (!carrier) {
        skipped++;

        errors.push({
          row,
          reason: `Carrier '${row.carrier}' not found`,
        });

        continue;
      }

      const key =
        `${carrier.id}_${row.service}_${row.startWeight}_${row.endWeight}`;

      const existing =
        existingMap.get(key);

      if (existing) {
        operations.push(
          this.prisma.sellerRateCard.update({
            where: {
              id: existing.id,
            },
            data: {
              name: row.name,

              maxWeight: row.maxWeight,

              additionalWeight:
                row.additionalWeight,

              localAmount:
                row.localAmount,

              localAdditionalAmount:
                row.localAdditionalAmount,

              stateAmount:
                row.stateAmount,

              stateAdditionalAmount:
                row.stateAdditionalAmount,

              roiAmount:
                row.roiAmount,

              roiAdditionalAmount:
                row.roiAdditionalAmount,

              metroAmount:
                row.metroAmount,

              metroAdditionalAmount:
                row.metroAdditionalAmount,

              specialAmount:
                row.specialAmount,

              specialAdditionalAmount:
                row.specialAdditionalAmount,
            },
          }),
        );
      } else {
        operations.push(
          this.prisma.sellerRateCard.create({
            data: {
              sellerId,

              carrierId:
                carrier.id,

              service:
                row.service as ServiceType,

              masterRateCardId:
                null,

              name:
                row.name,

              startWeight:
                row.startWeight,

              endWeight:
                row.endWeight,

              maxWeight:
                row.maxWeight,

              additionalWeight:
                row.additionalWeight,

              localAmount:
                row.localAmount,

              localAdditionalAmount:
                row.localAdditionalAmount,

              stateAmount:
                row.stateAmount,

              stateAdditionalAmount:
                row.stateAdditionalAmount,

              roiAmount:
                row.roiAmount,

              roiAdditionalAmount:
                row.roiAdditionalAmount,

              metroAmount:
                row.metroAmount,

              metroAdditionalAmount:
                row.metroAdditionalAmount,

              specialAmount:
                row.specialAmount,

              specialAdditionalAmount:
                row.specialAdditionalAmount,
            },
          }),
        );
      }

      imported++;
    } catch (error) {
      skipped++;

      errors.push({
        row,
        reason:
          error instanceof Error
            ? error.message
            : 'Unknown Error',
      });
    }
  }

  if (operations.length) {
    await this.prisma.$transaction(
      operations,
    );
  }

  return {
    success: true,
    totalRows: rows.length,
    imported,
    skipped,
    errors,
  };
}
}