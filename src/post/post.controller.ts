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
  @Get(":id")
  findAll(@Param('id',ParseIntPipe) classId : number, @Req() req : Request, @Body('isAdmin') isAdmin : boolean) {
    const userId = req.user['id'];
    return this.postService.findAll(userId, classId, isAdmin);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
