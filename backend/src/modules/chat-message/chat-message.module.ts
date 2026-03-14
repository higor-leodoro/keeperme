import { Module } from '@nestjs/common';
import { ChatMessageController } from './chat-message.controler';
import { ChatMessageService } from './chat-message.service';
import { ChatGateway } from './chat.gatway';
import { ChatSessionModule } from '../chat-session/chat-session.module';
import { ChatSessionService } from '../chat-session/chat-session.service';

@Module({
  imports: [ChatSessionModule],
  controllers: [ChatMessageController],
  providers: [ChatMessageService, ChatGateway, ChatSessionService],
})
export class ChatMessageModule {}
