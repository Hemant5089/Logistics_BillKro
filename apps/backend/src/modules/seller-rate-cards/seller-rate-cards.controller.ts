import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
// import { ImportSellerRateCardDto } from './dto/import-seller-rate-card.dto';
import { SellerRateCardsService } from './seller-rate-cards.service';
import { UpdateSellerRateCardDto } from './dto/update-seller-rate-card.dto';
import { CopyRateCardDto } from './dto/copy-rate-card.dto';
import { CopySellerRateCardDto } from './dto/copy-seller-rate-card.dto';

@Controller('seller-rate-cards')
export class SellerRateCardsController {
  constructor(
    private readonly sellerRateCardsService: SellerRateCardsService,
  ) {}

  @Get('seller/:sellerId')
  getSellerRateCards(
    @Param('sellerId') sellerId: string,
  ) {
    return this.sellerRateCardsService.getSellerRateCards(
      sellerId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateSellerRateCardDto,
  ) {
    return this.sellerRateCardsService.update(id, data);
  }

  @Post('copy')
copyRateCard(
  @Body() dto: CopyRateCardDto,
) {
  return this.sellerRateCardsService.copyRateCard(dto);
}

@Post('copy-seller')
copySellerRateCard(
  @Body() dto: CopySellerRateCardDto,
) {
  return this.sellerRateCardsService.copySellerRateCard(dto);
}

@Post(':sellerId/import')
@UseInterceptors(FileInterceptor('file'))
importSellerRateCard(
  @Param('sellerId') sellerId: string,
  @UploadedFile() file: any,
) {
  return this.sellerRateCardsService.importSellerRateCard(
    sellerId,
    file.buffer,
  );
}
}