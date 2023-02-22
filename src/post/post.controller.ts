import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Request } from 'express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AccessTokenGuard)
  @Post(":id")
  create(@Param('id',ParseIntPipe) classId: number, @Body() createPostDto: CreatePostDto, @Req() req : Request) {
    const userId = req.user['id'];
    return this.postService.create(userId, classId, createPostDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get("all/:spaceId")
  findAll(@Param('spaceId',ParseIntPipe) spaceId : number, @Req() req : Request) {
    const userId = req.user['id'];
    return this.postService.findAll(userId, spaceId);
  }

  @UseGuards(AccessTokenGuard)
  @Get('one/:spaceId/:postId')
  findOne(@Param() params,@Req() req : Request) {
    const userId = req.user['id'];
    return this.postService.findOne(userId, params.spaceId, params.postId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto); 
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':spaceId/:postId')
  remove(@Param() params,  @Req() req : Request) {
    const userId = req.user['id'];
    return this.postService.remove(userId, params.spaceId, params.postId);
  }
}
