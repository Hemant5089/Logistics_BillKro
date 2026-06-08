import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { SellersService } from './sellers.service';

@Controller('sellers')
export class SellersController {
  constructor(
    private readonly sellersService: SellersService,
  ) {}

  @Post()
  async create(
    @Body()
    body: {
      sellerName: string;
      companyName: string;
      email?: string;
      phone?: string;
      gstNumber?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
    },
  ) {
    return this.sellersService.create(body);
  }

  @Get()
  async findAll() {
    return this.sellersService.findAll();
  }
}