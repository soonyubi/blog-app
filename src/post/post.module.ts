import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Space } from 'src/entities/space.entity';
import { Take } from 'src/entities/take.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Posts, User, Space, Take])],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
