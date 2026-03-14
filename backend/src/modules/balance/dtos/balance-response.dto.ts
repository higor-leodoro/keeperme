import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BalanceResponseDto {
  @ApiProperty({
    description: 'Saldo total (receitas - despesas)',
    example: 2000,
  })
  @Expose()
  totalBalance: number;

  @ApiProperty({
    description: 'Total de receitas',
    example: 5000,
  })
  @Expose()
  totalIncome: number;

  @ApiProperty({
    description: 'Total de despesas',
    example: 3000,
  })
  @Expose()
  totalExpense: number;
}
