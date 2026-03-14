import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EditPermission, MemberRole } from '../../../generated/prisma/client';

class UserInfoDto {
  @ApiProperty({ description: 'ID do usuário' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nome do usuário' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'URL da foto do usuário', required: false })
  @Expose()
  photo?: string;
}

class GroupMemberDto {
  @ApiProperty({ description: 'ID do membro' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Papel do membro no grupo', enum: MemberRole })
  @Expose()
  role: MemberRole;

  @ApiProperty({ description: 'Se o membro está ativo no grupo' })
  @Expose()
  isActive: boolean;

  @ApiProperty({ description: 'Data de entrada no grupo' })
  @Expose()
  joinedAt: Date;

  @ApiProperty({ description: 'Informações do usuário', type: UserInfoDto })
  @Expose()
  @Type(() => UserInfoDto)
  user: UserInfoDto;
}

export class GroupResponseDto {
  @ApiProperty({ description: 'ID do grupo' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nome do grupo' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Descrição do grupo', required: false })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Permissão de edição do grupo',
    enum: EditPermission,
  })
  @Expose()
  editPermission: EditPermission;

  @ApiProperty({ description: 'Dono do grupo', type: UserInfoDto })
  @Expose()
  @Type(() => UserInfoDto)
  owner: UserInfoDto;

  @ApiProperty({
    description: 'Membros do grupo',
    type: [GroupMemberDto],
    isArray: true,
  })
  @Expose()
  @Type(() => GroupMemberDto)
  members: GroupMemberDto[];

  @ApiProperty({
    description: 'Número total de transações do grupo',
    required: false,
  })
  @Expose()
  transactionCount?: number;

  @ApiProperty({ description: 'Data de criação' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Data de última atualização' })
  @Expose()
  updatedAt: Date;
}
