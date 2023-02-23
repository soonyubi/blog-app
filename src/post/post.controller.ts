import { Controller, Get, Post, Body, Logger, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Request } from 'express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  private readonly logger = new Logger(PostController.name)
  @UseGuards(AccessTokenGuard)
  @Post(":spaceId")
  create(@Param('spaceId',ParseIntPipe) spaceId: number, @Body() createPostDto: CreatePostDto, @Req() req : Request) {
    this.logger.verbose("/POST /post/:spaceId executed");
    const userId = req.user['id'];
    return this.postService.create(userId, spaceId, createPostDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get("all/:spaceId")
  findAll(@Param('spaceId',ParseIntPipe) spaceId : number, @Req() req : Request) {
    this.logger.verbose("/GET /post/all/:spaceId executed");
    const userId = req.user['id'];
    return this.postService.findAll(userId, spaceId);
  }

  @UseGuards(AccessTokenGuard)
  @Get('one/:spaceId/:postId')
  findOne(@Param() params,@Req() req : Request) {
    this.logger.verbose("/GET /post/one/:spaceId/:postId executed");
    const userId = req.user['id'];
    return this.postService.findOne(userId, params.spaceId, params.postId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    this.logger.verbose("/PATCH /post/one/:spaceId/:postId executed");
    return "It is not working";
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':spaceId/:postId')
  remove(@Param() params,  @Req() req : Request) {
    this.logger.verbose("/DELETE /post/:spaceId/:postId executed");
    const userId = req.user['id'];
    return this.postService.remove(userId, params.spaceId, params.postId);
  }
}
