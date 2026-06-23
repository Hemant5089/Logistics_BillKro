import { Module } from '@nestjs/common';

import { PrismaModule } from '../../common/prisma/prisma.module';

import { RateCardsController } from './rate-cards.controller';
import { RateCardsService } from './rate-cards.service';

@Module({
  imports: [PrismaModule],

  controllers: [RateCardsController],

  providers: [RateCardsService],
})
export class RateCardsModule {}