import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { ZonesService } from './zones.service';

@Controller('zones')
export class ZonesController {
  constructor(
    private readonly zonesService: ZonesService,
  ) {}

  @Post()
  async create(
    @Body()
    body: {
      name: string;
    },
  ) {
    return this.zonesService.create(body);
  }

  @Get()
  async findAll() {
    return this.zonesService.findAll();
  }
}