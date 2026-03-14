import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategoryTotalDto {
  @ApiProperty({ description: 'ID da categoria' })
  @Expose()
  categoryId: string;

  @ApiProperty({ description: 'Nome da categoria' })
  @Expose()
  categoryName: string;

  @ApiProperty({ description: 'Valor total da categoria' })
  @Expose()
  total: number;

  @ApiProperty({ description: 'Número de transações nesta categoria' })
  @Expose()
  transactionCount: number;
}

