import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { ZonesService } from './zones.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('zones')
export class ZonesController {
  constructor(
    private readonly zonesService: ZonesService,
  ) {}

  @Public()
  @Post()
  async create(
    @Body()
    body: {
      name: string;
    },
  ) {
    return this.zonesService.create(body);
  }

  @Public()
  @Get()
  async findAll() {
    return this.zonesService.findAll();
  }
}