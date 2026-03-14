import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import OpenAI, { ClientOptions } from 'openai';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { CreateSessionDto, CreateSessionResponseDto } from './dtos';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ChatSessionService {
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
    dto: CreateSessionDto,
    userId: string,
  ): Promise<CreateSessionResponseDto> {
    try {
      const session = await this.prisma.chatSession.create({
        data: {
          platform: dto.platform,
          user: { connect: { id: userId } },
        },
        select: { id: true },
      });
      return plainToInstance(CreateSessionResponseDto, session, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException('Invalid user or platform');
      }
      throw new InternalServerErrorException('Failed to create session');
    }
  }

  async findOne(sessionId: string): Promise<{ id: string }> {
    try {
      return await this.prisma.chatSession.findUniqueOrThrow({
        where: { id: sessionId },
        select: { id: true },
      });
    } catch {
      throw new NotFoundException('Session not found');
    }
  }

  async findAll(userId: string): Promise<CreateSessionResponseDto[]> {
    try {
      const sessions = await this.prisma.chatSession.findMany({
        where: { userId },
        select: { id: true },
        orderBy: { updatedAt: 'desc' },
      });
      return plainToInstance(CreateSessionResponseDto, sessions, {
        excludeExtraneousValues: true,
      });
    } catch {
      throw new InternalServerErrorException('Failed to list sessions');
    }
  }
}
