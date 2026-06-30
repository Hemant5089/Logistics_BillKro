import { IsString } from 'class-validator';

export class CopySellerRateCardDto {
  @IsString()
  sourceSellerId: string;

  @IsString()
  targetSellerId: string;

  @IsString()
  carrierId: string;
}