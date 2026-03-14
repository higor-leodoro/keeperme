import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GroupInviteService } from './group-invite.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current.user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { InviteResponseDto } from './dtos';

@ApiTags('Invites')
@ApiBearerAuth('JWT-auth')
@Controller('invites')
@UseGuards(JwtAuthGuard)
export class InviteController {
  constructor(private readonly inviteService: GroupInviteService) {}

  @Get('pending')
  @ApiOperation({
    summary: 'Listar meus convites pendentes',
    description:
      'Retorna todos os convites pendentes para o email do usuário autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de convites pendentes',
    type: [InviteResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getPendingInvites(
    @CurrentUser() user: JwtPayload,
  ): Promise<InviteResponseDto[]> {
    return this.inviteService.findPendingByEmail(user.email);
  }

  @Post(':token/accept')
  @ApiOperation({
    summary: 'Aceitar convite',
    description:
      'Aceita um convite usando o token. O email do convite deve corresponder ao email do usuário autenticado.',
  })
  @ApiParam({ name: 'token', description: 'Token único do convite' })
  @ApiResponse({ status: 200, description: 'Convite aceito com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Convite inválido, expirado ou usuário já é membro',
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({
    status: 403,
    description: 'Convite não é para o email do usuário autenticado',
  })
  @ApiResponse({ status: 404, description: 'Convite não encontrado' })
  async acceptInvite(
    @Param('token') token: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    await this.inviteService.acceptInvite(token, user.sub);
    return { message: 'Invite accepted successfully' };
  }

  @Post(':token/reject')
  @ApiOperation({
    summary: 'Rejeitar convite',
    description: 'Rejeita um convite usando o token.',
  })
  @ApiParam({ name: 'token', description: 'Token único do convite' })
  @ApiResponse({ status: 200, description: 'Convite rejeitado com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Convite não está pendente',
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({
    status: 403,
    description: 'Convite não é para o email do usuário autenticado',
  })
  @ApiResponse({ status: 404, description: 'Convite não encontrado' })
  async rejectInvite(
    @Param('token') token: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    await this.inviteService.rejectInvite(token, user.sub);
    return { message: 'Invite rejected successfully' };
  }
}
