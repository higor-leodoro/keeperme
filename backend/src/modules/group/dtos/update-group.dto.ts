import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EditPermission } from '../../../generated/prisma/client';

export class UpdateGroupDto {
  @ApiPropertyOptional({
    description: 'Nome do grupo',
    example: 'Casa - Finanças 2024',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Descrição do grupo',
    example: 'Despesas compartilhadas atualizadas',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Permissão de edição de transações',
    enum: EditPermission,
    enumName: 'EditPermission',
  })
  @IsEnum(EditPermission)
  @IsOptional()
  editPermission?: EditPermission;
}
