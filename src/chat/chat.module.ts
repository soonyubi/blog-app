import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';

import { User } from 'src/entities/user.entity';
import { Posts } from 'src/entities/post.entity';
import { Take } from 'src/entities/take.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Chat, User, Posts,Take])],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
