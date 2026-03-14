import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, MemberRole } from '../../generated/prisma/client';
import { plainToInstance } from 'class-transformer';
import { CreateGroupDto, UpdateGroupDto, GroupResponseDto } from './dtos';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateGroupDto,
    userId: string,
  ): Promise<GroupResponseDto> {
    try {
      const group = await this.prisma.group.create({
        data: {
          name: data.name,
          description: data.description,
          editPermission: data.editPermission,
          ownerId: userId,
          members: {
            create: {
              userId: userId,
              role: MemberRole.OWNER,
              isActive: true,
            },
          },
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              photo: true,
            },
          },
          members: {
            where: { isActive: true },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  photo: true,
                },
              },
            },
          },
          _count: {
            select: { transactions: true },
          },
        },
      });

      return plainToInstance(
        GroupResponseDto,
        {
          ...group,
          transactionCount: group._count.transactions,
        },
        { excludeExtraneousValues: true },
      );
    } catch (error: unknown) {
      console.error('Error creating group:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid user reference');
        }
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to create group: ${message}`,
      );
    }
  }

  async findAllByUser(userId: string): Promise<GroupResponseDto[]> {
    try {
      const groups = await this.prisma.group.findMany({
        where: {
          members: {
            some: {
              userId: userId,
              isActive: true,
            },
          },
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              photo: true,
            },
          },
          members: {
            where: { isActive: true },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  photo: true,
                },
              },
            },
          },
          _count: {
            select: { transactions: true },
          },
        },
      });

      return groups.map((group) =>
        plainToInstance(
          GroupResponseDto,
          {
            ...group,
            transactionCount: group._count.transactions,
          },
          { excludeExtraneousValues: true },
        ),
      );
    } catch (error: unknown) {
      console.error('Error fetching groups:', error);
      throw new InternalServerErrorException('Failed to fetch groups');
    }
  }

  async findOne(id: string, userId: string): Promise<GroupResponseDto> {
    const group = await this.prisma.group.findFirst({
      where: {
        id,
        members: {
          some: {
            userId: userId,
            isActive: true,
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            photo: true,
          },
        },
        members: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                photo: true,
              },
            },
          },
        },
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }

    return plainToInstance(
      GroupResponseDto,
      {
        ...group,
        transactionCount: group._count.transactions,
      },
      { excludeExtraneousValues: true },
    );
  }

  async update(
    id: string,
    data: UpdateGroupDto,
    userId: string,
  ): Promise<GroupResponseDto> {
    // Validate user is owner
    const group = await this.prisma.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }

    if (group.ownerId !== userId) {
      throw new ForbiddenException('Only the group owner can update it');
    }

    try {
      const updatedGroup = await this.prisma.group.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          editPermission: data.editPermission,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              photo: true,
            },
          },
          members: {
            where: { isActive: true },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  photo: true,
                },
              },
            },
          },
          _count: {
            select: { transactions: true },
          },
        },
      });

      return plainToInstance(
        GroupResponseDto,
        {
          ...updatedGroup,
          transactionCount: updatedGroup._count.transactions,
        },
        { excludeExtraneousValues: true },
      );
    } catch (error: unknown) {
      console.error('Error updating group:', error);
      throw new InternalServerErrorException('Failed to update group');
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    // Validate user is owner
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }

    if (group.ownerId !== userId) {
      throw new ForbiddenException('Only the group owner can delete it');
    }

    if (group._count.transactions > 0) {
      throw new BadRequestException(
        'Cannot delete group with existing transactions',
      );
    }

    try {
      await this.prisma.group.delete({ where: { id } });
    } catch (error: unknown) {
      console.error('Error deleting group:', error);
      throw new InternalServerErrorException('Failed to delete group');
    }
  }

  async addMember(groupId: string, userId: string): Promise<void> {
    try {
      await this.prisma.groupMember.create({
        data: {
          groupId,
          userId,
          role: MemberRole.MEMBER,
          isActive: true,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('User is already a member of this group');
      }
      console.error('Error adding member:', error);
      throw new InternalServerErrorException('Failed to add member');
    }
  }

  async removeMember(
    groupId: string,
    memberUserId: string,
    requesterId: string,
  ): Promise<void> {
    // Validate requester is owner
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException(`Group with id ${groupId} not found`);
    }

    if (group.ownerId !== requesterId && memberUserId !== requesterId) {
      throw new ForbiddenException(
        'Only the owner or the member themselves can remove the member',
      );
    }

    // Owner cannot leave their own group
    if (group.ownerId === memberUserId) {
      throw new BadRequestException('Owner cannot leave the group');
    }

    try {
      await this.prisma.groupMember.updateMany({
        where: {
          groupId,
          userId: memberUserId,
        },
        data: {
          isActive: false,
        },
      });
    } catch (error: unknown) {
      console.error('Error removing member:', error);
      throw new InternalServerErrorException('Failed to remove member');
    }
  }

  async isMember(groupId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
        isActive: true,
      },
    });

    return !!member;
  }

  async isOwner(groupId: string, userId: string): Promise<boolean> {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    return group?.ownerId === userId;
  }
}
