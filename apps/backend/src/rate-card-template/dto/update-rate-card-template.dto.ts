import { PartialType } from '@nestjs/mapped-types';
import { CreateRateCardTemplateDto } from './create-rate-card-template.dto';

export class UpdateRateCardTemplateDto extends PartialType(
  CreateRateCardTemplateDto,
) {}