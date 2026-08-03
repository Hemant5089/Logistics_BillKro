import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RateCardsService } from './rate-cards.service';
import { CreateRateCardDto } from './dto/create-rate-card.dto';
import { UpdateRateCardDto } from './dto/update-rate-card.dto';

@Controller('rate-cards')
export class RateCardsController {
  constructor(private readonly rateCardsService: RateCardsService) {}

  @Post()
  create(@Body() createRateCardDto: CreateRateCardDto) {
    return this.rateCardsService.create(createRateCardDto);
  }

  @Get()
  findAll() {
    return this.rateCardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rateCardsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRateCardDto: UpdateRateCardDto) {
    return this.rateCardsService.update(+id, updateRateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rateCardsService.remove(+id);
  }
}
