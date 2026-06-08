import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CarriersService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(data: {
    name: string;
  }) {
    return this.prisma.carrier.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.carrier.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}