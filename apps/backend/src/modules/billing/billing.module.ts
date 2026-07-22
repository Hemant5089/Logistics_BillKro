import { Module } from '@nestjs/common';

import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

import { PrismaModule } from '../../common/prisma/prisma.module';

import { BillingEngineService } from './services/billing-engine.service';
import { RateResolverService } from './services/rate-resolver.service';
import { ForwardChargeService } from './services/forward-charge.service';
import { CodRtoService } from './services/cod-rto.service';
import { BillingPreviewService } from './services/billing-preview.service';

@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    BillingController,
  ],

  providers: [
    BillingService,

    BillingEngineService,

    BillingPreviewService,

    RateResolverService,

    ForwardChargeService,

    CodRtoService,
  ],

  exports: [
    BillingEngineService,
  ],
})
export class BillingModule {}