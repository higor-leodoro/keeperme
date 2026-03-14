import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { InviteStatus } from '../../../generated/prisma/client';

class InviteGroupInfoDto {
  @ApiProperty({ description: 'ID do grupo' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nome do grupo' })
  @Expose()
  name: string;
}

class InviteUserInfoDto {
  @ApiProperty({ description: 'Nome do usuário que enviou o convite' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Foto do usuário', required: false })
  @Expose()
  photo?: string;
}

export class InviteResponseDto {
  @ApiProperty({ description: 'ID do convite' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Email do convidado' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Token único do convite' })
  @Expose()
  token: string;

  @ApiProperty({ description: 'Status do convite', enum: InviteStatus })
  @Expose()
  status: InviteStatus;

  @ApiProperty({ description: 'Data de expiração do convite' })
  @Expose()
  expiresAt: Date;

  @ApiProperty({ description: 'Data de aceitação', required: false })
  @Expose()
  acceptedAt?: Date;

  @ApiProperty({
    description: 'Informações do grupo',
    type: InviteGroupInfoDto,
    required: false,
  })
  @Expose()
  @Type(() => InviteGroupInfoDto)
  group?: InviteGroupInfoDto;

  @ApiProperty({
    description: 'Usuário que enviou o convite',
    type: InviteUserInfoDto,
    required: false,
  })
  @Expose()
  @Type(() => InviteUserInfoDto)
  invitedByUser?: InviteUserInfoDto;

  @ApiProperty({ description: 'Data de criação do convite' })
  @Expose()
  createdAt: Date;
}
