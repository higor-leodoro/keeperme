import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '../../generated/prisma/client';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByGoogleId(googleId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { googleId },
    });
    if (!user) {
      throw new NotFoundException(`User with Google ID ${googleId} not found`);
    }
    return user;
  }

  async findByAppleId(appleId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { appleId },
    });
    if (!user) {
      throw new NotFoundException(`User with Apple ID ${appleId} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createWithPassword(data: {
    email: string;
    password: string;
    name: string;
    lastName: string;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findOrCreate(data: CreateUserDto): Promise<User> {
    if (!data.googleId) {
      throw new BadRequestException('Google ID is required');
    }

    try {
      const existing = await this.findByGoogleId(data.googleId);
      return await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          email: data.email,
          name: data.name,
          lastName: data.lastName,
          photo: data.photo,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        try {
          return await this.prisma.user.create({
            data: {
              googleId: data.googleId,
              email: data.email,
              name: data.name,
              lastName: data.lastName,
              photo: data.photo,
            },
          });
        } catch (err) {
          if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === 'P2002'
          ) {
            throw new BadRequestException('User already exists');
          }
          throw new InternalServerErrorException('Failed to create user');
        }
      }
      throw error;
    }
  }

  async findOrCreateApple(data: CreateUserDto): Promise<User> {
    if (!data.appleId) {
      throw new BadRequestException('Apple ID is required');
    }

    try {
      const existing = await this.findByAppleId(data.appleId);
      return await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          email: data.email,
          name: data.name,
          lastName: data.lastName,
          photo: data.photo,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        try {
          return await this.prisma.user.create({
            data: {
              appleId: data.appleId,
              email: data.email,
              name: data.name,
              lastName: data.lastName,
              photo: data.photo,
            },
          });
        } catch (_err) {
          throw new InternalServerErrorException('Failed to create user');
        }
      }
      throw error;
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
