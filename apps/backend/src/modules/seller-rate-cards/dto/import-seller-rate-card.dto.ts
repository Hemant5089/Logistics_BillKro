import { IsString } from 'class-validator';

export class ImportSellerRateCardDto {
  @IsString()
  sellerId!: string;

  @IsString()
  carrierId!: string;
}