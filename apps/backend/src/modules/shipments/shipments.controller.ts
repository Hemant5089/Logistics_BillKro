import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ShipmentUploadService } from './services/shipment-upload.service';

@Controller('shipments')
export class ShipmentsController {
  constructor(
    private readonly shipmentUploadService: ShipmentUploadService,
  ) {}

  @Post('test-import/:sellerId')
  @UseInterceptors(FileInterceptor('file'))
  async testImport(
    @Param('sellerId') sellerId: string,

    @UploadedFile() file: any,
  ) {
    return this.shipmentUploadService.upload(
      sellerId,
      file.buffer,
    );
  }
}