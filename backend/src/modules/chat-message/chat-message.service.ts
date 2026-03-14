import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI, { ClientOptions } from 'openai';
import { ChatRequestDto, ChatResponseDto } from './dtos';
import { plainToInstance } from 'class-transformer';
import {
  SYSTEM_PROMPT,
  CONTEXT_WINDOW,
  SUMMARIZE_THRESHOLD,
} from '../../openai-config';

@Injectable()
export class ChatMessageService {
  private openai: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<{ OPENAI_API_KEY: string }>,
  ) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY must be defined');
    }
    const options: ClientOptions = { apiKey };
    this.openai = new OpenAI(options);
  }

  async create(
    sessionId: string,
    dto: ChatRequestDto,
  ): Promise<ChatResponseDto> {
    let sessionSummary: string | null;
    try {
      const session = await this.prisma.chatSession.findUnique({
        where: { id: sessionId },
        select: { summary: true },
      });
      if (!session) {
        throw new NotFoundException(`Session with id ${sessionId} not found`);
      }
      sessionSummary = session.summary;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to validate session');
    }

    let recent: Array<{ sender: string; content: string }>;
    try {
      recent = await this.prisma.chatMessage.findMany({
        where: { sessionId },
        orderBy: { timestamp: 'desc' },
        take: CONTEXT_WINDOW,
        select: { sender: true, content: true },
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch message history');
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: sessionSummary ?? SYSTEM_PROMPT },
      ...recent.reverse().map((m) => ({
        role: m.sender === 'USER' ? ('user' as const) : ('assistant' as const),
        content: m.content,
      })),
      { role: 'user', content: dto.message },
    ];

    let reply: string;
    try {
      const res = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0,
      });
      reply = res.choices[0]?.message.content ?? '';
    } catch {
      throw new InternalServerErrorException('OpenAI request failed');
    }

    try {
      const now = new Date();
      await this.prisma.chatMessage.createMany({
        data: [
          {
            sessionId,
            sender: 'USER',
            messageType: 'TEXT',
            content: dto.message,
            timestamp: now,
          },
          {
            sessionId,
            sender: 'ASSISTANT',
            messageType: 'TEXT',
            content: reply,
            timestamp: now,
          },
        ],
      });

      await this.prisma.chatSession.update({
        where: { id: sessionId },
        data: { messageCount: { increment: 2 } },
      });
    } catch {
      throw new InternalServerErrorException('Failed to persist chat messages');
    }

    let messageCount: number;
    try {
      const session = await this.prisma.chatSession.findUnique({
        where: { id: sessionId },
        select: { messageCount: true },
      });
      messageCount = (session?.messageCount as number) ?? 0;
    } catch {
      throw new InternalServerErrorException('Failed to fetch message count');
    }

    if (messageCount >= SUMMARIZE_THRESHOLD) {
      await this.summarize(sessionId);
    }

    return plainToInstance(
      ChatResponseDto,
      { reply },
      { excludeExtraneousValues: true },
    );
  }

  private async summarize(sessionId: string): Promise<void> {
    const all = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
    });
    if (all.length < SUMMARIZE_THRESHOLD) return;

    const recent = all.slice(-CONTEXT_WINDOW);
    const toSummarize = all.slice(0, -CONTEXT_WINDOW);

    const block = toSummarize
      .map((m) => `${m.sender}: ${m.content}`)
      .join('\n');

    const res = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Summarize this conversation:\n${block}` },
      ],
      temperature: 0,
    });
    const newSummary = res.choices[0]?.message?.content?.trim() ?? '';

    await this.prisma.$transaction([
      this.prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          summary: newSummary,
          messageCount: recent.length,
        },
      }),
      this.prisma.chatMessage.deleteMany({
        where: { sessionId, id: { in: toSummarize.map((m) => m.id) } },
      }),
    ]);
  }
}
