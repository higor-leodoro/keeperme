import { Module } from '@nestjs/common';
import { ChatSessionService } from './chat-session.service';
import { ChatSessionController } from './chat-session.controller';

@Module({
  providers: [ChatSessionService],
  controllers: [ChatSessionController],
})
export class ChatSessionModule {}
