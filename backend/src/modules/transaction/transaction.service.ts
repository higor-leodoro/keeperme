import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { Prisma, EditPermission } from '../../generated/prisma/client';
import {
  CreateTransactionDto,
  TransactionResponseDto,
  UpdateTransactionDto,
  CategoryTotalDto,
  CategoryTotalQueryDto,
} from './dtos';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateTransactionDto,
    userId: string,
  ): Promise<TransactionResponseDto> {
    // If groupId is provided, validate user is member of the group
    if (data.groupId) {
      const isMember = await this.prisma.groupMember.findFirst({
        where: {
          groupId: data.groupId,
          userId: userId,
          isActive: true,
        },
      });

      if (!isMember) {
        throw new ForbiddenException(
          'You must be a member of the group to create transactions',
        );
      }
    }

    try {
      const transactionData: any = {
        amount: data.amount,
        type: data.type,
        description: data.description,
        date: data.date ? new Date(data.date) : new Date(),
        category: { connect: { id: data.categoryId } },
        user: { connect: { id: userId } },
      };

      if (data.groupId) {
        transactionData.group = { connect: { id: data.groupId } };
      }

      const transaction = await this.prisma.transaction.create({
        data: transactionData,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return plainToInstance(TransactionResponseDto, transaction, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException('Invalid category, user, or group');
      }
      throw new InternalServerErrorException('Failed to create transaction');
    }
  }

  async findAll(
    userId: string,
    groupId?: string,
  ): Promise<TransactionResponseDto[]> {
    try {
      let whereClause: any = { userId };

      // If groupId is provided, return only transactions for that group
      // Otherwise, return only individual transactions (groupId is null)
      if (groupId) {
        // Validate user is member of the group
        const isMember = await this.prisma.groupMember.findFirst({
          where: {
            groupId: groupId,
            userId: userId,
            isActive: true,
          },
        });

        if (!isMember) {
          throw new ForbiddenException('You are not a member of this group');
        }

        whereClause = { groupId };
      } else {
        whereClause.groupId = null;
      }

      const transactions = await this.prisma.transaction.findMany({
        where: whereClause,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      return plainToInstance(TransactionResponseDto, transactions, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch transactions');
    }
  }

  async findOne(id: string): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return plainToInstance(TransactionResponseDto, transaction, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    data: UpdateTransactionDto,
    userId: string,
  ): Promise<TransactionResponseDto> {
    // Validate edit permissions
    await this.validateEditPermission(id, userId);

    try {
      const updateData: Prisma.TransactionUpdateInput = {};

      if (data.amount !== undefined) {
        updateData.amount = data.amount;
      }
      if (data.type !== undefined) {
        updateData.type = data.type;
      }
      if (data.description !== undefined) {
        updateData.description = data.description;
      }
      if (data.categoryId !== undefined) {
        updateData.category = { connect: { id: data.categoryId } };
      }
      if (data.date !== undefined) {
        updateData.date = new Date(data.date);
      }

      const transaction = await this.prisma.transaction.update({
        where: { id },
        data: updateData,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return plainToInstance(TransactionResponseDto, transaction, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Transaction with id ${id} not found`);
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException('Invalid category');
      }
      throw new InternalServerErrorException('Failed to update transaction');
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    // Validate edit permissions
    await this.validateEditPermission(id, userId);

    try {
      await this.prisma.transaction.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Transaction with id ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to delete transaction');
    }
  }

  async findByGroup(
    groupId: string,
    userId: string,
  ): Promise<TransactionResponseDto[]> {
    return this.findAll(userId, groupId);
  }

  async getAmountSpentByAllCategories(
    userId: string,
    filters: CategoryTotalQueryDto,
  ): Promise<CategoryTotalDto[]> {
    try {
      // Build where clause
      const whereClause: any = {};

      // Handle groupId filter
      if (filters.groupId) {
        // Validate user is member of the group
        const isMember = await this.prisma.groupMember.findFirst({
          where: {
            groupId: filters.groupId,
            userId: userId,
            isActive: true,
          },
        });

        if (!isMember) {
          throw new ForbiddenException('You are not a member of this group');
        }

        whereClause.groupId = filters.groupId;
      } else {
        // If no groupId, only individual transactions
        whereClause.userId = userId;
        whereClause.groupId = null;
      }

      // Add type filter if provided
      if (filters.type) {
        whereClause.type = filters.type;
      }

      // Add date range filters
      if (filters.startDate || filters.endDate) {
        whereClause.date = {};
        if (filters.startDate) {
          whereClause.date.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          whereClause.date.lte = new Date(filters.endDate);
        }
      }

      // Get aggregated data grouped by category
      const aggregatedData = await this.prisma.transaction.groupBy({
        by: ['categoryId'],
        where: whereClause,
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      });

      // Get category names
      const categoryIds = aggregatedData.map((item) => item.categoryId);
      const categories = await this.prisma.category.findMany({
        where: {
          id: { in: categoryIds },
        },
        select: {
          id: true,
          name: true,
        },
      });

      // Map categories for quick lookup
      const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

      // Build response
      const result: CategoryTotalDto[] = aggregatedData.map((item) => ({
        categoryId: item.categoryId,
        categoryName: categoryMap.get(item.categoryId) || 'Unknown',
        total: item._sum.amount || 0,
        transactionCount: item._count.id,
      }));

      return plainToInstance(CategoryTotalDto, result, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch totals by category',
      );
    }
  }

  async getAmountSpentByCategoryId(
    categoryId: string,
    userId: string,
    filters: CategoryTotalQueryDto,
  ): Promise<CategoryTotalDto> {
    try {
      // Validate that the category exists
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        select: {
          id: true,
          name: true,
        },
      });

      if (!category) {
        throw new NotFoundException(`Category with id ${categoryId} not found`);
      }

      // Build where clause
      const whereClause: any = {
        categoryId: categoryId,
      };

      // Handle groupId filter
      if (filters.groupId) {
        // Validate user is member of the group
        const isMember = await this.prisma.groupMember.findFirst({
          where: {
            groupId: filters.groupId,
            userId: userId,
            isActive: true,
          },
        });

        if (!isMember) {
          throw new ForbiddenException('You are not a member of this group');
        }

        whereClause.groupId = filters.groupId;
      } else {
        // If no groupId, only individual transactions
        whereClause.userId = userId;
        whereClause.groupId = null;
      }

      // Add type filter if provided
      if (filters.type) {
        whereClause.type = filters.type;
      }

      // Add date range filters
      if (filters.startDate || filters.endDate) {
        whereClause.date = {};
        if (filters.startDate) {
          whereClause.date.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          whereClause.date.lte = new Date(filters.endDate);
        }
      }

      // Get aggregated data for the specific category
      const aggregatedData = await this.prisma.transaction.aggregate({
        where: whereClause,
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      });

      // Build response
      const result: CategoryTotalDto = {
        categoryId: category.id,
        categoryName: category.name,
        total: aggregatedData._sum.amount || 0,
        transactionCount: aggregatedData._count.id,
      };

      return plainToInstance(CategoryTotalDto, result, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch total for category',
      );
    }
  }

  private async validateEditPermission(
    transactionId: string,
    userId: string,
  ): Promise<void> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        group: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${transactionId} not found`,
      );
    }

    // If transaction is individual (no group), only creator can edit
    if (!transaction.groupId) {
      if (transaction.userId !== userId) {
        throw new ForbiddenException(
          'You can only edit your own individual transactions',
        );
      }
      return;
    }

    // Validate user is member of the group
    const member = await this.prisma.groupMember.findFirst({
      where: {
        groupId: transaction.groupId,
        userId: userId,
        isActive: true,
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Check edit permissions based on group settings
    const group = transaction.group;

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    switch (group.editPermission) {
      case EditPermission.OWNER_ONLY:
        if (group.ownerId !== userId) {
          throw new ForbiddenException(
            'Only the group owner can edit transactions',
          );
        }
        break;

      case EditPermission.OWN_TRANSACTIONS_ONLY:
        if (transaction.userId !== userId) {
          throw new ForbiddenException(
            'You can only edit your own transactions',
          );
        }
        break;

      case EditPermission.ALL_MEMBERS:
        // All members can edit, already validated membership above
        break;

      default:
        throw new InternalServerErrorException('Invalid edit permission');
    }
  }
}
