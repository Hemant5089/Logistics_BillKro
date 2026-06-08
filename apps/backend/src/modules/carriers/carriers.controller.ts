import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { CarriersService } from './carriers.service';

@Controller('carriers')
export class CarriersController {
  constructor(
    private readonly carriersService: CarriersService,
  ) {}

  @Post()
  async create(
    @Body()
    body: {
      name: string;
    },
  ) {
    return this.carriersService.create(body);
  }

  @Get()
  async findAll() {
    return this.carriersService.findAll();
  }
}