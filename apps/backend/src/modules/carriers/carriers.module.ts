import { Module } from '@nestjs/common';

import { CarriersController } from './carriers.controller';
import { CarriersService } from './carriers.service';

import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
  controllers: [CarriersController],
  providers: [
    CarriersService,
    PrismaService,
  ],
})
export class CarriersModule {}