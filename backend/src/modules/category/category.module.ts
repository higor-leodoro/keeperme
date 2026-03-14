import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  providers: [PrismaService, CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
