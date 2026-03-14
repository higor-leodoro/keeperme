import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EditPermission } from '../../../generated/prisma/client';

export class CreateGroupDto {
  @ApiProperty({
    description: 'Nome do grupo',
    example: 'Casa - Finanças',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descrição do grupo (opcional)',
    example: 'Despesas compartilhadas do casal',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Permissão de edição de transações do grupo',
    enum: EditPermission,
    example: EditPermission.OWN_TRANSACTIONS_ONLY,
    enumName: 'EditPermission',
  })
  @IsEnum(EditPermission)
  @IsNotEmpty()
  editPermission: EditPermission;
}
