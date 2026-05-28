import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { BillingModule } from './modules/billing/billing.module';
import { ShipmentsModule } from './modules/shipments/shipments.module';

@Module({
  imports: [AuthModule, UsersModule, UploadsModule, BillingModule, ShipmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
