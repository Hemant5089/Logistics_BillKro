import {
  Controller,
  Get,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { SellersService } from './sellers.service';

@Controller('sellers')
export class SellersController {
  constructor(
    private readonly sellersService: SellersService,
  ) {}

  @Post()
  create(
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
  findAll() {
    return this.sellersService.findAll();
  }

  // @Get(':sellerId/rate-cards')
  // getSellerRateCards(
  //   @Param('sellerId') sellerId: string,
  // ) {
  //   return this.sellersService.getSellerRateCards(
  //     sellerId,
  //   );
  // }
}