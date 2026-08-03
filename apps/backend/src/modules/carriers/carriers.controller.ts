import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { CarriersService } from './carriers.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('carriers')
export class CarriersController {
  constructor(
    private readonly carriersService: CarriersService,
  ) {}

  @Public()
  @Post()
  async create(
    @Body()
    body: {
      name: string;
    },
  ) {
    return this.carriersService.create(body);
  }

  @Public()
  @Get()
  async findAll() {
    return this.carriersService.findAll();
  }
}