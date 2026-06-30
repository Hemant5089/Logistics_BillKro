// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../../common/prisma/prisma.service';

// @Injectable()
// export class ShipmentsService {
//   constructor(
//     private prisma: PrismaService,
//   ) {}

//   async create(data: {
//     awbNumber: string;
//     sellerId: string;
//     carrierId: string;
//     zoneId: string;
//     weight: number;
//   }) {
//     return this.prisma.shipment.create({
//       data,
//       include: {
//         seller: true,
//         carrier: true,
//         zone: true,
//       },
//     });
//   }

//   async findAll() {
//     return this.prisma.shipment.findMany({
//       include: {
//         seller: true,
//         carrier: true,
//         zone: true,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//   }
// }