import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../../../generated/prisma/client';
import { IsEnum, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CategoryTotalQueryDto {
  @ApiPropertyOptional({ description: 'ID do grupo (opcional)' })
  @IsOptional()
  @IsUUID()
  groupId?: string;

  @ApiPropertyOptional({
    enum: TransactionType,
    description: 'Tipo de transação (INCOME ou EXPENSE)',
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional({ description: 'Data inicial (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Data final (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
