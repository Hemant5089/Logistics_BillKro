import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { BillingModule } from './modules/billing/billing.module';
// import { ShipmentsModule } from './modules/shipments/shipments.module';
import { CarriersModule } from './modules/carriers/carriers.module';
import { ZonesModule } from './modules/zones/zones.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { RateCardTemplateModule } from './rate-card-template/rate-card-template.module';
import { SellerRateCardsModule } from './modules/seller-rate-cards/seller-rate-cards.module';

@Module({
  // imports: [AuthModule, UsersModule, UploadsModule, BillingModule, ShipmentsModule, SellersModule, CarriersModule, ZonesModule, DashboardModule],
    imports: [AuthModule, UsersModule, UploadsModule, BillingModule, SellersModule,CarriersModule,ZonesModule,DashboardModule, RateCardTemplateModule, SellerRateCardsModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
