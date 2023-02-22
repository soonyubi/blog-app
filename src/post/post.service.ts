import { ForbiddenException } from '@nestjs/common';
import { Injectable , BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { Posts } from 'src/entities/post.entity';
import { Space } from 'src/entities/space.entity';
import { Take } from 'src/entities/take.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private postsRepository : Repository<Posts>,
    @InjectRepository(User) private userRepository : Repository<User>,
    @InjectRepository(Space) private spaceRepository : Repository<Space>,
    @InjectRepository(Take) private takeRepository : Repository<Take>,
    ){}

  async create(userId: number, spaceId : number, createPostDto: CreatePostDto) {
    const {title,description,files,isNotification, isAdmin, isAnonymous} = createPostDto;
    if(isAnonymous&&isAdmin) throw new BadRequestException("Admin can't create post in anonymous");
    if(isNotification&&!isAdmin) throw new BadRequestException("Participant can't create notification post");
    
    const space = await this.spaceRepository.findOne({where:{id:spaceId}});
    if(!space) throw new BadRequestException("invalid space id");
    const files_str = JSON.stringify(files); // ["abc.com","efg.com"] -> "["abc.com","efg.com"]" 
    return this.postsRepository.save({
      title,
      description,
      files: files_str,
      isNotification,
      isAdmin,
      isAnonymous,
      userId,
      space : space
    });
  }

  
  async findAll(id : number, spaceId: number, isAdmin : boolean) {
    const posts = await this.postsRepository.find();
    
    const result = [];
    const result2 = [];
    for(var i = 0;i<posts.length;i++){
      const {id, createdAt, updatedAt, title, description, files, isNotification, isAdmin, isAnonymous, userId} = posts[i];
      const user = await this.userRepository.findOne({where:{id:userId}});

      const res = {id, createdAt, updatedAt, title, description, files, isNotification, isAdmin, isAnonymous, user};

      result.push(res);
      if(userId !== id && isAnonymous){
        res.user = null;
        result2.push(res);
      } else{
        result2.push(res);
      }

    }

    if(isAdmin) return result;
    return result2;
  }

  async findOne(userId : number, spaceId: number, postId : number) {
      // 1. 해당 post가 존재하는지
      const post = await this.postsRepository.findOne({where:{id:postId}});
      if(!post) throw new BadRequestException("The post doesn't exist");

      return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(userId : number,spaceId: number, postId: number) {
    // 1. 해당 유저가 관리자이거나 글의 작성자인지 verify 
    
    const isAdmin = await this.isAdmin(userId, spaceId);
    const post = await this.postsRepository.findOne({where:{id : postId}});
    console.log(post.userId);
    console.log(isAdmin);
    if(post.userId !== userId && !isAdmin) throw new ForbiddenException("You dont have right to delete this post");
    
    // post db에서 해당 post 삭제 
    return this.postsRepository.softDelete({id:postId});
    // class 내에서 해당 post 삭제
    
  }

  // 유저가 해당 클래스의 admin인지 확인하는 helper function
  async isAdmin(userId : number, spaceId : number){
    const take = await this.takeRepository.findOne( {userId, spaceId},{relations:['role']});
    if(!take) throw new BadRequestException("You are not participating in this class");
    return take.role.isAdmin; 
  }


  
}
