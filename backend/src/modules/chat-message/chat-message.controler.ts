import { Body, Controller, Param, Post } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatRequestDto, ChatResponseDto } from './dtos';

@Controller('chat-message')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Post(':sessionId')
  async create(
    @Param('sessionId') sessionId: string,
    @Body() message: ChatRequestDto,
  ): Promise<ChatResponseDto> {
    return this.chatMessageService.create(sessionId, message);
  }

  // @Post('transcribe')
  // async transcribe(
  //   @Body() dto: TranscribeRequestDto,
  // ): Promise<{ text: string }> {
  //   const text = await this.chatMessageService.transcribe(dto);
  //   return { text };
  // }
}
