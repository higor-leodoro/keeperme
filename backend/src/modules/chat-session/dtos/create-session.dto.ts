import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { Platform } from '../../../generated/prisma/client';

export class CreateSessionDto {
  @ApiPropertyOptional({
    description: 'Platform from which the session is initiated',
    enum: Platform as object,
    example: 'APP',
  })
  @IsOptional()
  @IsEnum(Platform as object, { message: 'platform must be APP or WHATSAPP' })
  platform?: Platform;
}
