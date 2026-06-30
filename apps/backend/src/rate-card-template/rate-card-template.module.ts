import { Module } from '@nestjs/common';
import { RateCardTemplateController } from './rate-card-template.controller';
import { RateCardTemplateService } from './rate-card-template.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { ExcelImportService } from './services/excel-import.service';

@Module({
  controllers: [RateCardTemplateController],
  providers: [
    RateCardTemplateService,
    PrismaService,
    ExcelImportService,
  ],
})
export class RateCardTemplateModule {}