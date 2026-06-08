import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SellersService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(data: {
    sellerName: string;
    companyName: string;
    email?: string;
    phone?: string;
    gstNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }) {
    return this.prisma.seller.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.seller.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}