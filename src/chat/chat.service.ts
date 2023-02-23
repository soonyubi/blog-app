import { Injectable,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import { Posts } from 'src/entities/post.entity';
import { Take } from 'src/entities/take.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    // @InjectRepository(Reply) private replyRepository: Repository<Reply>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
    @InjectRepository(Take) private takeRepository: Repository<Take>,
    ){}

  async create(userId: number, postId : number, createChatDto: CreateChatDto) {
    // 익명 && 관리자 -> 에러 
    
    const post = await this.postRepository.findOne({id:postId},{relations:['space']});  
    if(!post) throw new BadRequestException("Invalid post");
    const verify = await this.isAdmin(userId, post.space.id);
    if(verify && createChatDto.isAnonymous) throw new BadRequestException("Admin can't create chat in anonymous");

    return this.chatRepository.save({
        ...createChatDto,
        userId, 
        post
    });
  }

  async findAll(userId : number, postId : number) {
    const post = await this.postRepository.findOne({id:postId});
    if(!post) throw new BadRequestException("Invalid post");
    const verify = await this.isAdmin(userId,post.space.id);
    
    const chat = await this.chatRepository.find();

    // post를 root로 하는 dfs 스패닝 트리 , JSON 
    // {chat-1 : [reply1 : [], .... ],}
    const result = {}; 
    // TODO : DFS 를 돌면서 내부의 모든 Chat과 reply 를 얻을 수 있도록 
      // TODO : 관리자라면, chat 내부의 모든 user가 보일 수 있도록 
      // TODO : 관리자가 아니라면, Chat 내부의 자기 자신이 아닌 익명은 모두 null 처리
  
    
  }

  async remove(userId : number, postId : number, chatId : number) {
    const post = await this.postRepository.findOne({id:postId});
    if(!post) throw new BadRequestException("Invalid post");
    const verify = await this.isAdmin(userId,post.space.id);
    const chat = await this.chatRepository.findOne({id : chatId});

    if(chat.userId === userId || verify){
      return this.chatRepository.softDelete({id:chatId});
    }else{
      throw new BadRequestException("You cant remove this chat");
    }
  }

  async isAdmin(userId : number, spaceId : number){
    const take = await this.takeRepository.findOne( {userId, spaceId},{relations:['role']});
    if(!take) throw new BadRequestException("You are not participating in this class");
    return take.role.isAdmin; 
  }
}
