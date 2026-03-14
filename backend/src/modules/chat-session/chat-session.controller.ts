import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSessionDto, CreateSessionResponseDto } from './dtos';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { ChatSessionService } from './chat-session.service';

@Controller('chat-session')
export class ChatSessionController {
  constructor(private readonly chatSessionService: ChatSessionService) {}

  @Post()
  async create(
    @Body() dto: CreateSessionDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<CreateSessionResponseDto> {
    return this.chatSessionService.create(dto, user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ id: string }> {
    return this.chatSessionService.findOne(id);
  }

  @Get()
  async findAll(
    @CurrentUser() user: JwtPayload,
  ): Promise<CreateSessionResponseDto[]> {
    return this.chatSessionService.findAll(user.sub);
  }
}
