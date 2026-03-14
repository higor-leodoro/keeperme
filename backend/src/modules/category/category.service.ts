import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string): Promise<Category> {
    return await this.prisma.category.create({
      data: { name },
    });
  }

  async findAll(): Promise<Category[]> {
    const categories: Category[] = await this.prisma.category.findMany();
    if (categories.length === 0) {
      throw new NotFoundException(`No categories found`);
    }

    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category: Category | null = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category found`);
    }

    return category;
  }

  async update(id: string, name: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.category.update({
      where: { id },
      data: { name },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
