import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatSessionService } from '../chat-session/chat-session.service';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  public server!: Server;

  constructor(
    private readonly chatService: ChatMessageService,
    private readonly chatSessionService: ChatSessionService,
  ) {}

  public afterInit(): void {
    console.log('Chat gateway initialized');
  }

  @SubscribeMessage('join')
  public async handleJoin(
    @MessageBody() payload: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      await this.chatSessionService.findOne(payload.sessionId);
      await client.join(payload.sessionId);
    } catch {
      client.emit('chat.error', { status: 'Session not found' });
      client.disconnect(true);
    }
  }

  @SubscribeMessage('message')
  public async handleMessage(
    @MessageBody() payload: { sessionId: string; message: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const { reply } = await this.chatService.create(payload.sessionId, {
        message: payload.message,
      });
      this.server.to(payload.sessionId).emit('chat.reply', reply);
    } catch (err: unknown) {
      let errorMsg: string;

      if (err instanceof NotFoundException) {
        errorMsg = err.message;
      } else if (err instanceof BadRequestException) {
        errorMsg = err.message;
      } else if (err instanceof Error) {
        errorMsg = 'Internal server error';
        console.error('Gateway error:', err);
      } else {
        errorMsg = 'Internal server error';
      }

      client.emit('chat.error', { status: errorMsg });
    }
  }
}
