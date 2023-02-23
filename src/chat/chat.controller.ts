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
    return this.chatService.createChat(userId, postId, createChatDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get(":postId")
  findAll(@Param('postId') postId: number, @Req() req : Request) {
    const userId = req.user['id'];
    return this.chatService.findAllChat(userId, postId);
  }


  @UseGuards(AccessTokenGuard)
  @Post(":chatId/reply")
  createReply(@Param('chatId') chatId: number , @Req() req : Request, @Body() createChatDto : CreateChatDto) {
    const userId = req.user['id'];
    return this.chatService.createReplyToChat(userId, chatId, createChatDto);
    
  }

  @UseGuards(AccessTokenGuard)
  @Post(":chatId/reply/:replyId")
  createReplytoReply(@Param() params, @Req() req : Request,  @Body() createChatDto : CreateChatDto){
    const userId = req.user['id'];
    return this.chatService.createReplyToReply(userId, params.chatId, params.replyId, createChatDto);
  }

  
  @UseGuards(AccessTokenGuard)
  @Delete(':postId/:chatId')
  remove(@Param() params , @Req() req : Request) {
    const userId = req.user['id'];
    return this.chatService.removeChat(userId, params.postId, params.chatId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(":chatId/reply/:replyId")
  deleteReplyToChat(@Param() params , @Req() req : Request){
    const userId = req.user['id'];
    return this.chatService.removeReply(userId, params.chatId, params.replyId); 
  }

  
  
}
