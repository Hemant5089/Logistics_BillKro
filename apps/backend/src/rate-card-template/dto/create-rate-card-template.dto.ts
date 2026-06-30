import {
  IsEnum,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ServiceType } from '@prisma/client';

export class CreateRateCardTemplateDto {
  @IsString()
  carrierId: string;

  @IsEnum(ServiceType)
  service: ServiceType;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  startWeight: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  endWeight: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxWeight: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  additionalWeight: number;

  @Type(() => Number)
  @IsNumber()
  localAmount: number;

  @Type(() => Number)
  @IsNumber()
  localAdditionalAmount: number;

  @Type(() => Number)
  @IsNumber()
  stateAmount: number;

  @Type(() => Number)
  @IsNumber()
  stateAdditionalAmount: number;

  @Type(() => Number)
  @IsNumber()
  roiAmount: number;

  @Type(() => Number)
  @IsNumber()
  roiAdditionalAmount: number;

  @Type(() => Number)
  @IsNumber()
  metroAmount: number;

  @Type(() => Number)
  @IsNumber()
  metroAdditionalAmount: number;

  @Type(() => Number)
  @IsNumber()
  specialAmount: number;

  @Type(() => Number)
  @IsNumber()
  specialAdditionalAmount: number;
}