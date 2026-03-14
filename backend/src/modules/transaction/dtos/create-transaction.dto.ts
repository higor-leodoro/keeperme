import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  IsString,
  IsDateString,
} from 'class-validator';
import { TransactionType } from '../../../generated/prisma/client';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType, { message: 'type must be INCOME or EXPENSE' })
  type: TransactionType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  groupId?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  date?: string;
}
