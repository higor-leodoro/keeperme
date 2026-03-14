import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class TranscribeRequestDto {
  @ApiProperty({
    description: 'URL of the audio file to transcribe',
    example: 'https://example.com/audio123.mp3',
  })
  @IsString()
  @IsUrl()
  url: string;
}
