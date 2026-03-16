import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { BalanceResponseDto } from './dtos';

@Injectable()
export class BalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(
    userId: string,
    groupId?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<BalanceResponseDto> {
    try {
      // Build where clause based on groupId
      let whereClauseBase: any = {};

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

        whereClauseBase = { groupId };
      } else {
        // Individual transactions only
        whereClauseBase = { userId, groupId: null };
      }

      // Add date range filters
      if (startDate || endDate) {
        whereClauseBase.date = {};
        if (startDate) {
          whereClauseBase.date.gte = new Date(startDate);
        }
        if (endDate) {
          whereClauseBase.date.lte = new Date(endDate);
        }
      }

      // Get total income
      const incomeResult = await this.prisma.transaction.aggregate({
        where: {
          ...whereClauseBase,
          type: 'INCOME',
        },
        _sum: {
          amount: true,
        },
      });

      // Get total expense
      const expenseResult = await this.prisma.transaction.aggregate({
        where: {
          ...whereClauseBase,
          type: 'EXPENSE',
        },
        _sum: {
          amount: true,
        },
      });

      const totalIncome = incomeResult._sum.amount || 0;
      const totalExpense = expenseResult._sum.amount || 0;
      const totalBalance = totalIncome - totalExpense;

      const result: BalanceResponseDto = {
        totalBalance,
        totalIncome,
        totalExpense,
      };

      return plainToInstance(BalanceResponseDto, result, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch balance');
    }
  }
}


