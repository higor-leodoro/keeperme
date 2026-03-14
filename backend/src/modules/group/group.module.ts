import { Module, forwardRef } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupInviteService } from './group-invite.service';
import { GroupController } from './group.controller';
import { InviteController } from './invite.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [PrismaModule, forwardRef(() => TransactionModule)],
  controllers: [GroupController, InviteController],
  providers: [GroupService, GroupInviteService],
  exports: [GroupService, GroupInviteService],
})
export class GroupModule {}
