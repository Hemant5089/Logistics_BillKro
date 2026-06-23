import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { BillingModule } from './modules/billing/billing.module';
import { ShipmentsModule } from './modules/shipments/shipments.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { CarriersModule } from './modules/carriers/carriers.module';
import { ZonesModule } from './modules/zones/zones.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { RateCardsModule } from './modules/rate-cards/rate-cards.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),

    AuthModule,
    UsersModule,
    UploadsModule,
    BillingModule,
    ShipmentsModule,
    SellersModule,
    CarriersModule,
    ZonesModule,
    DashboardModule,
    RateCardsModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}