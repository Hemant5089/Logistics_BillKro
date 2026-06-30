import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { RateCardTemplateService } from './rate-card-template.service';
// import { ExcelImportService } from './services/excel-import.service';

import { CreateRateCardTemplateDto } from './dto/create-rate-card-template.dto';
import { UpdateRateCardTemplateDto } from './dto/update-rate-card-template.dto';

@Controller('rate-card-template')
export class RateCardTemplateController {
  constructor(
    private readonly rateCardTemplateService: RateCardTemplateService,
    // private readonly excelImportService: ExcelImportService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateRateCardTemplateDto,
  ) {
    return this.rateCardTemplateService.create(dto);
  }

  @Get()
  findAll() {
    return this.rateCardTemplateService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.rateCardTemplateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRateCardTemplateDto,
  ) {
    return this.rateCardTemplateService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.rateCardTemplateService.remove(id);
  }

@Post('import')
@UseInterceptors(FileInterceptor('file'))
importExcel(
  @UploadedFile() file: any,
) {
  return this.rateCardTemplateService.importExcel(
    file.buffer,
  );
}
}