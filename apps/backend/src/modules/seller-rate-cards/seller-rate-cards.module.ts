import { Module } from '@nestjs/common';
import { SellerRateCardsController } from './seller-rate-cards.controller';
import { SellerRateCardsService } from './seller-rate-cards.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExcelImportService } from '../../rate-card-template/services/excel-import.service';


@Module({
  controllers: [SellerRateCardsController],
  providers: [
    SellerRateCardsService,
    PrismaService,
    ExcelImportService,
  ],
})
export class SellerRateCardsModule {}