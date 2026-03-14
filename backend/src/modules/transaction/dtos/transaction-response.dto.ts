import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../../generated/prisma/client';
import { Expose, Transform, Type } from 'class-transformer';

class TransactionUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

class TransactionGroupDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

class TransactionCategoryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class TransactionResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  amount: number;

  @ApiProperty({ enum: TransactionType })
  @Expose()
  type: TransactionType;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  @Type(() => TransactionCategoryDto)
  category: TransactionCategoryDto;

  @ApiProperty({ required: false })
  @Expose()
  groupId?: string;

  @ApiProperty({ required: false })
  @Expose()
  @Type(() => TransactionGroupDto)
  group?: TransactionGroupDto;

  @ApiProperty({ required: false })
  @Expose()
  @Type(() => TransactionUserDto)
  user?: TransactionUserDto;

  @ApiProperty()
  @Expose()
  @Transform(({ value }: { value: Date | string }) => {
    const dateValue = value instanceof Date ? value : new Date(value);
    return dateValue.toISOString().slice(0, 10);
  })
  date: Date;
}
