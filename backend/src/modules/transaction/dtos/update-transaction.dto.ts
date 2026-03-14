import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { TransactionType } from '../../../generated/prisma/client';

export class UpdateTransactionDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  amount?: number;

  @ApiProperty({ enum: TransactionType, required: false })
  @IsEnum(TransactionType)
  @IsOptional()
  @IsNotEmpty()
  type?: TransactionType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  @IsNotEmpty()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  @IsNotEmpty()
  date?: string;
}
