import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Inject,
  forwardRef,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GroupService } from './group.service';
import { GroupInviteService } from './group-invite.service';
import { TransactionService } from '../transaction/transaction.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import {
  CreateGroupDto,
  UpdateGroupDto,
  GroupResponseDto,
  CreateInviteDto,
  InviteResponseDto,
} from './dtos';
import { TransactionResponseDto } from '../transaction/dtos';

@ApiTags('Groups')
@ApiBearerAuth('JWT-auth')
@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly inviteService: GroupInviteService,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar novo grupo',
    description:
      'Cria um novo grupo financeiro. O usuário que cria torna-se automaticamente o owner (dono) do grupo.',
  })
  @ApiResponse({
    status: 201,
    description: 'Grupo criado com sucesso',
    type: GroupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<GroupResponseDto> {
    return this.groupService.create(createGroupDto, user.sub);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar meus grupos',
    description:
      'Retorna todos os grupos dos quais o usuário autenticado é membro (owner ou membro regular).',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos',
    type: [GroupResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(@CurrentUser() user: JwtPayload): Promise<GroupResponseDto[]> {
    return this.groupService.findAllByUser(user.sub);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar grupo por ID',
    description: 'Retorna detalhes completos de um grupo específico.',
  })
  @ApiParam({ name: 'id', description: 'ID do grupo' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do grupo',
    type: GroupResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (não é membro)' })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<GroupResponseDto> {
    return this.groupService.findOne(id, user.sub);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar grupo',
    description:
      'Atualiza informações do grupo. Apenas o owner pode atualizar.',
  })
  @ApiParam({ name: 'id', description: 'ID do grupo' })
  @ApiResponse({
    status: 200,
    description: 'Grupo atualizado com sucesso',
    type: GroupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão (apenas owner pode atualizar)',
  })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<GroupResponseDto> {
    return this.groupService.update(id, updateGroupDto, user.sub);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar grupo',
    description:
      'Deleta um grupo. Apenas o owner pode deletar. O grupo não pode ter transações.',
  })
  @ApiParam({ name: 'id', description: 'ID do grupo' })
  @ApiResponse({ status: 200, description: 'Grupo deletado com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Grupo possui transações e não pode ser deletado',
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão (apenas owner pode deletar)',
  })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    await this.groupService.delete(id, user.sub);
    return { message: 'Group deleted successfully' };
  }

  @Post(':id/invites')
  @ApiOperation({
    summary: 'Criar convite para grupo',
    description:
      'Envia um convite para um usuário entrar no grupo. O convite expira em 7 dias.',
  })
  @ApiParam({ name: 'id', description: 'ID do grupo' })
  @ApiResponse({
    status: 201,
    description: 'Convite criado com sucesso',
    type: InviteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Email já convidado ou já é membro',
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (não é membro)' })
  async createInvite(
    @Param('id') groupId: string,
    @Body() createInviteDto: CreateInviteDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<InviteResponseDto> {
    return this.inviteService.createInvite(
      groupId,
      createInviteDto.email,
      user.sub,
    );
  }

  @Get(':id/invites')
  @ApiOperation({
    summary: 'Listar convites do grupo',
    description:
      'Lista todos os convites do grupo (pendentes, aceitos, rejeitados, expirados).',
  })
  @ApiParam({ name: 'id', description: 'ID do grupo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de convites',
    type: [InviteResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (não é membro)' })
  async getGroupInvites(
    @Param('id') groupId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<InviteResponseDto[]> {
    return this.inviteService.findByGroup(groupId, user.sub);
  }

  @Delete(':id/invites/:inviteId')
  @ApiOperation({
    summary: 'Cancelar convite',
    description: 'Cancela um convite pendente.',
  })
  @ApiParam({ name: 'id', description: 'ID do grupo' })
  @ApiParam({ name: 'inviteId', description: 'ID do convite' })
  @ApiResponse({ status: 200, description: 'Convite cancelado com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Convite não está pendente',
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Convite não encontrado' })
  async cancelInvite(
    @Param('id') groupId: string,
    @Param('inviteId') inviteId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    await this.inviteService.cancelInvite(inviteId, groupId, user.sub);
    return { message: 'Invite cancelled successfully' };
  }

  @Delete(':id/members/:userId')
  @ApiOperation({
    summary: 'Remover membro do grupo',
    description:
      'Remove um membro do grupo (soft delete). Owner ou o próprio membro podem fazer isso.',
  })
  @ApiParam({ name: 'id', description: 'ID do grupo' })
  @ApiParam({ name: 'userId', description: 'ID do usuário a ser removido' })
  @ApiResponse({ status: 200, description: 'Membro removido com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Owner não pode sair do próprio grupo',
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado' })
  async removeMember(
    @Param('id') groupId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    await this.groupService.removeMember(groupId, userId, user.sub);
    return { message: 'Member removed successfully' };
  }

  @Get(':id/transactions')
  @ApiOperation({
    summary: 'Listar transações do grupo',
    description:
      'Lista todas as transações do grupo, independente de quem criou.',
  })
  @ApiParam({ name: 'id', description: 'ID do grupo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de transações do grupo',
    type: [TransactionResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Sem permissão (não é membro)' })
  getGroupTransactions(
    @Param('id') groupId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionService.findByGroup(groupId, user.sub);
  }
}
