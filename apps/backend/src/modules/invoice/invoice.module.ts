import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './services/invoice/invoice.service';
import { InvoicePdfService } from './services/invoice-pdf/invoice-pdf.service';
import { InvoiceExcelService } from './services/invoice-excel/invoice-excel.service';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
    InvoicePdfService,
    InvoiceExcelService,
    PrismaService,
  ],
})
export class InvoiceModule {}