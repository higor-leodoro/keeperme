import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BalanceModule } from './modules/balance/balance.module';
import { CategoryModule } from './modules/category/category.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { UserModule } from './modules/user/user.module';
import { ChatMessageModule } from './modules/chat-message/chat-message.module';
import { ChatSessionModule } from './modules/chat-session/chat-session.module';
import { GroupModule } from './modules/group/group.module';

@Module({
  imports: [
    AuthModule,
    BalanceModule,
    CategoryModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ChatMessageModule,
    ChatSessionModule,
    GroupModule,
    PrismaModule,
    TransactionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
