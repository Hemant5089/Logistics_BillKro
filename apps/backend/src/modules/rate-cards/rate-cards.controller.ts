import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { RateCardsService } from './rate-cards.service';

@Controller('rate-cards')
export class RateCardsController {
  constructor(
    private readonly rateCardsService: RateCardsService,
  ) {}

  @Post()
  async create(
    @Body() body: any,
  ) {
    return this.rateCardsService.create(
      body,
    );
  }

  @Get()
  async findAll() {
    return this.rateCardsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ) {
    return this.rateCardsService.findOne(
      id,
    );
  }
}