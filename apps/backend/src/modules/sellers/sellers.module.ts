import { Module } from '@nestjs/common';

import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';

import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
  controllers: [SellersController],
  providers: [
    SellersService,
    PrismaService,
  ],
})
export class SellersModule {}