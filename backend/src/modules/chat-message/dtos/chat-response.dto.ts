import { Expose } from 'class-transformer';

export class ChatResponseDto {
  @Expose() reply: string;
}
