import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { SellersService } from './sellers.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('sellers')
export class SellersController {
  constructor(
    private readonly sellersService: SellersService,
  ) {}

  @Public()
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

  @Public()
  @Get()
  findAll() {
    return this.sellersService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellersService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.sellersService.update(id, body);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellersService.remove(id);
  }
}