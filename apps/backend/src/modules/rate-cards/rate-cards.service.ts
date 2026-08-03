import { Injectable } from '@nestjs/common';
import { CreateRateCardDto } from './dto/create-rate-card.dto';
import { UpdateRateCardDto } from './dto/update-rate-card.dto';

@Injectable()
export class RateCardsService {
  create(createRateCardDto: CreateRateCardDto) {
    return 'This action adds a new rateCard';
  }

  findAll() {
    return `This action returns all rateCards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rateCard`;
  }

  update(id: number, updateRateCardDto: UpdateRateCardDto) {
    return `This action updates a #${id} rateCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} rateCard`;
  }
}
