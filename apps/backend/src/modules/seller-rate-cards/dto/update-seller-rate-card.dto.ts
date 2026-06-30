import { PartialType } from '@nestjs/mapped-types';
import { CreateSellerRateCardDto } from './create-seller-rate-card.dto';

export class UpdateSellerRateCardDto extends PartialType(CreateSellerRateCardDto) {}
