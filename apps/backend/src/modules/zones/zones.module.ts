import { Module } from '@nestjs/common';

import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';

import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
  controllers: [ZonesController],
  providers: [
    ZonesService,
    PrismaService,
  ],
})
export class ZonesModule {}