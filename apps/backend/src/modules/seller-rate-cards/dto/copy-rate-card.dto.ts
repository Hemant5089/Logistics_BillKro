import { IsString } from 'class-validator';

export class CopyRateCardDto {
  @IsString()
  sellerId: string;

  @IsString()
  carrierId: string;
}