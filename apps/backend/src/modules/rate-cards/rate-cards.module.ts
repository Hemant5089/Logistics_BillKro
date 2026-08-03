import { Module } from '@nestjs/common';
import { RateCardsService } from './rate-cards.service';
import { RateCardsController } from './rate-cards.controller';

@Module({
  controllers: [RateCardsController],
  providers: [RateCardsService],
})
export class RateCardsModule {}
