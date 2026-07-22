import { Module } from '@nestjs/common';

import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';

import { ShipmentImportService } from './services/shipment-import.service';
import { ShipmentValidationService } from './services/shipment-validation.service';
import { WeightCalculatorService } from './services/weight-calculator.service';
import { ZoneResolverService } from './services/zone-resolver.service';
import { ShipmentUploadService } from './services/shipment-upload.service';

@Module({
  controllers: [ShipmentsController],

  providers: [
    ShipmentsService,

    ShipmentImportService,

    ShipmentValidationService,

    WeightCalculatorService,

    ZoneResolverService,

    ShipmentUploadService,
  ],
})
export class ShipmentsModule {}