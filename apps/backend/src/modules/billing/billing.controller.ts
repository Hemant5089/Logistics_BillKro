import { Controller, Get,Post,Param, Query } from '@nestjs/common';
import { BillingEngineService } from './services/billing-engine.service';
import { BillingPreviewService } from './services/billing-preview.service';

@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingPreview: BillingPreviewService,
    private readonly billingEngine: BillingEngineService,
  ) {}

  @Get('preview/:sellerId')
  async preview(
    @Param('sellerId') sellerId: string,

    @Query('month') billingMonth: string,
  ) {
    return this.billingPreview.previewBill(
      sellerId,
      billingMonth,
    );
  }

  @Post('generate/:sellerId')
async generate(
  @Param('sellerId') sellerId: string,

  @Query('month') billingMonth: string,
) {
  return this.billingEngine.generateBill(
    sellerId,
    billingMonth,
  );
}

}