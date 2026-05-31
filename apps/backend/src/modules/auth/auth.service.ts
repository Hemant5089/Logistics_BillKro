import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService }
from 'src/common/prisma/prisma.service';

import { RegisterDto }
from './dto/register.dto';

import { LoginDto }
from './dto/login.dto';

import * as bcrypt from 'bcrypt';

import { JwtService }
from '@nestjs/jwt';

@Injectable()

export class AuthService {

  constructor(

    private prisma: PrismaService,

    private jwtService: JwtService,

  ) {}

  async register(
    dto: RegisterDto,
  ) {

    const existingUser =
      await this.prisma.user.findUnique({

        where: {
          email: dto.email,
        },

      });

    if (existingUser) {

      throw new BadRequestException(
        'Email already exists',
      );

    }

    const hashedPassword =
      await bcrypt.hash(
        dto.password,
        10,
      );

    const user =
      await this.prisma.user.create({

        data: {

          name: dto.name,

          email: dto.email,

          password: hashedPassword,

        },

      });

    return {
  message: 'User registered successfully',
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  },
};
  }

  async login(
    dto: LoginDto,
  ) {

    const user =
      await this.prisma.user.findUnique({

        where: {
          email: dto.email,
        },

      });

    if (!user) {

      throw new UnauthorizedException(
        'Invalid credentials',
      );

    }

    const isPasswordValid =
      await bcrypt.compare(
        dto.password,
        user.password,
      );

    if (!isPasswordValid) {

      throw new UnauthorizedException(
        'Invalid credentials',
      );

    }

    const accessToken =
      await this.jwtService.signAsync({

        sub: user.id,

        email: user.email,

        role: user.role,

      });

    return {

      accessToken,

      user: {

        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,

      },

    };
  }
}