import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { TransactionService } from './transaction.service';
import { JwtPayload } from '../auth/jwt.strategy';
import {
  CreateTransactionDto,
  TransactionResponseDto,
  UpdateTransactionDto,
  CategoryTotalDto,
  CategoryTotalQueryDto,
} from './dtos';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() data: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.create(data, user.sub);
  }

  @Get()
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query('groupId') groupId?: string,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionService.findAll(user.sub, groupId);
  }

  @Get('/all-categories')
  async getAmountSpentByAllCategories(
    @CurrentUser() user: JwtPayload,
    @Query() filters: CategoryTotalQueryDto,
  ): Promise<CategoryTotalDto[]> {
    return this.transactionService.getAmountSpentByAllCategories(
      user.sub,
      filters,
    );
  }

  @Get('/category/:id')
  async getAmountSpentByCategoryId(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Query() filters: CategoryTotalQueryDto,
  ): Promise<CategoryTotalDto> {
    return this.transactionService.getAmountSpentByCategoryId(
      id,
      user.sub,
      filters,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TransactionResponseDto> {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateTransactionDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.update(id, data, user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    await this.transactionService.remove(id, user.sub);
    return { message: 'Transaction deleted successfully' };
  }
}
