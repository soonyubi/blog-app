import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AccessTokenGuard)
  @Post(":postId")
  create(@Param('postId') postId: number,@Body() createChatDto: CreateChatDto, @Req() req : Request) {
    const userId = req.user['id'];
    return this.chatService.create(userId, postId, createChatDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get(":postId")
  findAll(@Param('postId') postId: number, @Req() req : Request) {
    const userId = req.user['id'];
    return this.chatService.findAll(userId, postId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':postId/:chatId')
  remove(@Param() params , @Req() req : Request) {
    const userId = req.user['id'];
    return this.chatService.remove(userId, params.postId, params.chatId);
  }
}
