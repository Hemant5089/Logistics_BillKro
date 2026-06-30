// import {
//   Body,
//   Controller,
//   Get,
//   Post,
// } from '@nestjs/common';

// import { ShipmentsService } from './shipments.service';

// @Controller('shipments')
// export class ShipmentsController {
//   constructor(
//     private readonly shipmentsService: ShipmentsService,
//   ) {}

//   @Post()
//   create(
//     @Body()
//     body: {
//       awbNumber: string;
//       sellerId: string;
//       carrierId: string;
//       zoneId: string;
//       weight: number;
//     },
//   ) {
//     return this.shipmentsService.create(body);
//   }
//   @Get()
//   findAll() {
//     return this.shipmentsService.findAll();
//   }
// }