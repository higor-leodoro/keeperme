import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateSessionResponseDto {
  @ApiProperty({ description: 'Identifier for the chat session' })
  @Expose()
  id: string;
}
