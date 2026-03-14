import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';

@Module({
  providers: [PrismaService, BalanceService],
  controllers: [BalanceController],
  exports: [BalanceService],
})
export class BalanceModule {}

