import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';

import { ReportsService } from './reports.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Public()
  @Get('summary')
  async summary() {
    return this.reportsService.getSummary();
  }

  @Public()
  @Get('billing')
  async billingReport(
    @Query('sellerId') sellerId?: string,

    @Query('billingMonth') billingMonth?: string,
  ) {
    return this.reportsService.getBillingReport(
      sellerId,
      billingMonth,
    );
  }
}