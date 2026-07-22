import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { Res } from '@nestjs/common';
import type { Response } from 'express';
import { InvoiceExcelService } from './services/invoice-excel/invoice-excel.service';

import { InvoiceService } from './services/invoice/invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly invoiceExcelService:InvoiceExcelService,
  ) {}

  @Get(':sellerId')
  async summary(
    @Param('sellerId') sellerId: string,

    @Query('month') billingMonth: string,
  ) {
    return this.invoiceService.getInvoiceSummary(
      sellerId,
      billingMonth,
    );
  }

  @Get('excel/:sellerId')
async downloadExcel(
  @Param('sellerId') sellerId: string,
  @Query('month') billingMonth: string,
  @Res() res: Response,
) {
  return this.invoiceExcelService.downloadExcel(
    sellerId,
    billingMonth,
    res,
  );
}


}