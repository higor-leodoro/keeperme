import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInviteDto {
  @ApiProperty({
    description: 'Email do usuário a ser convidado',
    example: 'parceiro@email.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
