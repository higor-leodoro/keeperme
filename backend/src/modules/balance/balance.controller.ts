import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { BalanceService } from './balance.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { BalanceResponseDto } from './dtos';

@ApiTags('Balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  async getBalance(
    @CurrentUser() user: JwtPayload,
    @Query('groupId') groupId?: string,
  ): Promise<BalanceResponseDto> {
    return this.balanceService.getBalance(user.sub, groupId);
  }
}


