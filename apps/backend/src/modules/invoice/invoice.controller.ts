import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Res,
  Body,
  Req,
} from '@nestjs/common';

import type { Response } from 'express';

import { InvoiceService } from './services/invoice/invoice.service';

import { InvoiceExcelService } from './services/invoice-excel/invoice-excel.service';

import { InvoicePdfService } from './services/invoice-pdf/invoice-pdf.service';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,

    private readonly invoiceExcelService:
      InvoiceExcelService,

    private readonly invoicePdfService:
      InvoicePdfService,
  ) {}

  // ==========================================
  // Excel
  // ==========================================

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

  // ==========================================
  // PDF
  // ==========================================

  @Post('pdf/:sellerId')
  async downloadPdf(
    @Param('sellerId') sellerId: string,

    @Query('month') billingMonth: string,

    @Body()
    body: {
      invoicePrefix: string;
      invoiceNumber: string;
    },

    @Req() req: any,

    @Res() res: Response,
  ) {
    const userId = req.user.id;

    return this.invoicePdfService.generatePdf(
      sellerId,
      billingMonth,
      body.invoicePrefix,
      body.invoiceNumber,
      userId,
      res,
    );
  }

  // ==========================================
  // Invoice Summary
  // ==========================================

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
}