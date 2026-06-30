import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateRateCardTemplateDto } from './dto/create-rate-card-template.dto';
import { UpdateRateCardTemplateDto } from './dto/update-rate-card-template.dto';
import { ExcelImportService } from './services/excel-import.service';
import { ServiceType } from '@prisma/client';

@Injectable()
export class RateCardTemplateService {
  constructor(
    private prisma: PrismaService,
    private excelImportService: ExcelImportService,
  ) {}

  async create(data: CreateRateCardTemplateDto) {
    const carrier = await this.prisma.carrier.findUnique({
      where: {
        id: data.carrierId,
      },
    });

    if (!carrier) {
      throw new NotFoundException(
        'Carrier not found',
      );
    }
const existing =
  await this.prisma.rateCardTemplate.findFirst({
    where: {
      carrierId: data.carrierId,
      service: data.service,
      startWeight: data.startWeight,
      endWeight: data.endWeight,
    },
  });

    if (existing) {
      throw new BadRequestException(
        'Rate card already exists for this weight slab.',
      );
    }

    return this.prisma.rateCardTemplate.create({
      data,
      include: {
        carrier: true,
      },
    });
  }

  async findAll() {
    return this.prisma.rateCardTemplate.findMany({
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

  async findOne(id: string) {
    const rateCard =
      await this.prisma.rateCardTemplate.findUnique({
        where: {
          id,
        },
        include: {
          carrier: true,
        },
      });

    if (!rateCard) {
      throw new NotFoundException(
        'Rate card not found',
      );
    }

    return rateCard;
  }

  async update(
    id: string,
    data: UpdateRateCardTemplateDto,
  ) {
    await this.findOne(id);

    return this.prisma.rateCardTemplate.update({
      where: {
        id,
      },
      data,
      include: {
        carrier: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.rateCardTemplate.delete({
      where: {
        id,
      },
    });
  }


 async importExcel(buffer: Buffer) {
  const rows = this.excelImportService.parseExcel(buffer);

  let imported = 0;
  let skipped = 0;

  const errors: any[] = [];

  // Load all carriers once
  const carriers = await this.prisma.carrier.findMany();

  const carrierMap = new Map(
    carriers.map((carrier) => [
      carrier.name.trim().toLowerCase(),
      carrier,
    ]),
  );

  // Load all existing rate cards once
  const existingRateCards =
    await this.prisma.rateCardTemplate.findMany();

  const existingMap = new Map(
    existingRateCards.map(rate=>[
       `${rate.carrierId}_${rate.name}_${rate.service}_${rate.startWeight}_${rate.endWeight}`,
       rate
    ])
);

  // Collect database operations
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
`${carrier.id}_${row.name}_${row.service}_${row.startWeight}_${row.endWeight}`;
      const existing = existingMap.get(key);

      if (existing) {
        operations.push(
          this.prisma.rateCardTemplate.update({
            where: {
              id: existing.id,
            },
            data: {
              name: row.name,

              maxWeight: row.maxWeight,

              additionalWeight:
                row.additionalWeight,

              localAmount: row.localAmount,

              localAdditionalAmount:
                row.localAdditionalAmount,

              stateAmount: row.stateAmount,

              stateAdditionalAmount:
                row.stateAdditionalAmount,

              roiAmount: row.roiAmount,

              roiAdditionalAmount:
                row.roiAdditionalAmount,

              metroAmount: row.metroAmount,

              metroAdditionalAmount:
                row.metroAdditionalAmount,

              specialAmount: row.specialAmount,

              specialAdditionalAmount:
                row.specialAdditionalAmount,
            },
          }),
        );
      } else {
        operations.push(
          this.prisma.rateCardTemplate.create({
            data: {
              name: row.name,

              carrierId: carrier.id,

              service: row.service as ServiceType,

              startWeight: row.startWeight,

              endWeight: row.endWeight,

              maxWeight: row.maxWeight,

              additionalWeight:
                row.additionalWeight,

              localAmount: row.localAmount,

              localAdditionalAmount:
                row.localAdditionalAmount,

              stateAmount: row.stateAmount,

              stateAdditionalAmount:
                row.stateAdditionalAmount,

              roiAmount: row.roiAmount,

              roiAdditionalAmount:
                row.roiAdditionalAmount,

              metroAmount: row.metroAmount,

              metroAdditionalAmount:
                row.metroAdditionalAmount,

              specialAmount: row.specialAmount,

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

  // Execute all create/update operations in a single transaction
  if (operations.length > 0) {
    await this.prisma.$transaction(operations);
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