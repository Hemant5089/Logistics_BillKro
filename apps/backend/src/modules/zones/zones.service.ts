import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ZonesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(data: {
    name: string;
  }) {
    return this.prisma.zone.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.zone.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}