import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteStatus, Prisma } from '../../generated/prisma/client';
import { plainToInstance } from 'class-transformer';
import { InviteResponseDto } from './dtos';
import { GroupService } from './group.service';

@Injectable()
export class GroupInviteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groupService: GroupService,
  ) {}

  async createInvite(
    groupId: string,
    email: string,
    invitedBy: string,
  ): Promise<InviteResponseDto> {
    const isMember = await this.groupService.isMember(groupId, invitedBy);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      const alreadyMember = await this.groupService.isMember(
        groupId,
        existingUser.id,
      );
      if (alreadyMember) {
        throw new BadRequestException('User is already a member of this group');
      }
    }

    const existingInvite = await this.prisma.groupInvite.findFirst({
      where: {
        groupId,
        email,
        status: InviteStatus.PENDING,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingInvite) {
      throw new BadRequestException(
        'A pending invite already exists for this email',
      );
    }

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const invite = await this.prisma.groupInvite.create({
        data: {
          groupId,
          email,
          invitedBy,
          status: InviteStatus.PENDING,
          expiresAt,
        },
        include: {
          group: {
            select: {
              id: true,
              name: true,
            },
          },
          invitedByUser: {
            select: {
              name: true,
              email: true,
              photo: true,
            },
          },
        },
      });

      return plainToInstance(InviteResponseDto, invite, {
        excludeExtraneousValues: true,
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Invite already exists');
      }
      console.error('Error creating invite:', error);
      throw new InternalServerErrorException('Failed to create invite');
    }
  }

  async findPendingByEmail(email: string): Promise<InviteResponseDto[]> {
    try {
      const invites = await this.prisma.groupInvite.findMany({
        where: {
          email,
          status: InviteStatus.PENDING,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          group: {
            select: {
              id: true,
              name: true,
            },
          },
          invitedByUser: {
            select: {
              name: true,
              email: true,
              photo: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return invites.map((invite) =>
        plainToInstance(InviteResponseDto, invite, {
          excludeExtraneousValues: true,
        }),
      );
    } catch (error: unknown) {
      console.error('Error fetching invites:', error);
      throw new InternalServerErrorException('Failed to fetch invites');
    }
  }

  async findByGroup(
    groupId: string,
    userId: string,
  ): Promise<InviteResponseDto[]> {
    const isMember = await this.groupService.isMember(groupId, userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this group');
    }

    try {
      const invites = await this.prisma.groupInvite.findMany({
        where: {
          groupId,
        },
        include: {
          group: {
            select: {
              id: true,
              name: true,
            },
          },
          invitedByUser: {
            select: {
              name: true,
              email: true,
              photo: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return invites.map((invite) =>
        plainToInstance(InviteResponseDto, invite, {
          excludeExtraneousValues: true,
        }),
      );
    } catch (error: unknown) {
      console.error('Error fetching group invites:', error);
      throw new InternalServerErrorException('Failed to fetch group invites');
    }
  }

  async acceptInvite(token: string, userId: string): Promise<void> {
    const invite = await this.prisma.groupInvite.findUnique({
      where: { token },
      include: {
        group: true,
      },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Invite is not pending');
    }

    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('Invite has expired');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.email !== invite.email) {
      throw new ForbiddenException('This invite is not for your email');
    }

    const alreadyMember = await this.groupService.isMember(
      invite.groupId,
      userId,
    );
    if (alreadyMember) {
      throw new BadRequestException('You are already a member of this group');
    }

    try {
      await this.prisma.$transaction([
        this.prisma.groupInvite.update({
          where: { id: invite.id },
          data: {
            status: InviteStatus.ACCEPTED,
            acceptedAt: new Date(),
          },
        }),
        this.prisma.groupMember.create({
          data: {
            groupId: invite.groupId,
            userId: userId,
            role: 'MEMBER',
            isActive: true,
          },
        }),
      ]);
    } catch (error: unknown) {
      console.error('Error accepting invite:', error);
      throw new InternalServerErrorException('Failed to accept invite');
    }
  }

  async rejectInvite(token: string, userId: string): Promise<void> {
    const invite = await this.prisma.groupInvite.findUnique({
      where: { token },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Invite is not pending');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.email !== invite.email) {
      throw new ForbiddenException('This invite is not for your email');
    }

    try {
      await this.prisma.groupInvite.update({
        where: { id: invite.id },
        data: {
          status: InviteStatus.REJECTED,
        },
      });
    } catch (error: unknown) {
      console.error('Error rejecting invite:', error);
      throw new InternalServerErrorException('Failed to reject invite');
    }
  }

  async cancelInvite(
    inviteId: string,
    groupId: string,
    userId: string,
  ): Promise<void> {
    const isMember = await this.groupService.isMember(groupId, userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const invite = await this.prisma.groupInvite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.groupId !== groupId) {
      throw new ForbiddenException('This invite does not belong to this group');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Can only cancel pending invites');
    }

    try {
      await this.prisma.groupInvite.update({
        where: { id: inviteId },
        data: {
          status: InviteStatus.EXPIRED,
        },
      });
    } catch (error: unknown) {
      console.error('Error canceling invite:', error);
      throw new InternalServerErrorException('Failed to cancel invite');
    }
  }
}
