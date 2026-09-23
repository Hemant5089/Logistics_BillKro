import { Module } from '@nestjs/common';

import { PrismaModule } from '../../common/prisma/prisma.module';

import { InvoiceController } from './invoice.controller';

import { InvoiceService } from './services/invoice/invoice.service';

import { InvoiceExcelService } from './services/invoice-excel/invoice-excel.service';

import { InvoicePdfService } from './services/invoice-pdf/invoice-pdf.service';

@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    InvoiceController,
  ],

  providers: [
    InvoiceService,
    InvoiceExcelService,
    InvoicePdfService,
  ],
})
export class InvoiceModule {}