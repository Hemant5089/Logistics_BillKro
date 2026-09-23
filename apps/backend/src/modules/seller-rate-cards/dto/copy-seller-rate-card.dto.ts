import {
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class CopySellerRateCardDto {
  @IsString()
  sourceSellerId!: string;

  @IsOptional()
  @IsString()
  targetSellerId?: string;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  targetSellerIds?: string[];

  @IsOptional()
  @IsString()
  carrierId?: string;
}
